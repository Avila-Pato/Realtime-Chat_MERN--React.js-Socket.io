import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import { getReceiverSocketId, io } from "../lib/socket.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    // obteniendo usuario por si ud
    const loggedInUserId = req.user._id;
    //En la base de datos se buscan a todos los usuarios excepto el que esta actualemte autentificado
    //.select excluye el password por razones de seguridad son buenas practicas
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    //si todo sale bn  devuelve lso datos filtrados en un estado 200 que es ok
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error en obtener al usuario", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
export const getMessages = async (req, res) => {
  try {
    // extrae al usuario con el cual queremos chatear de los parametros
    const { id: userToChatId } = req.params;
    //Obtiene el usiario por su id
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        // 1. Enviados por el usuario autenticado y recibidos por el usuario con el que estamos chateando.
        { senderId: myId, receiveId: userToChatId },
        // 2. Recibidos por el usuario autenticado y enviados por el usuario con el que estamos chateando.
        { senderId: userToChatId, receiveId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error en controlador getMessages", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    // extrae el texto o imagen del cuerpo de la solicitud 
    const { text, image } = req.body;
    // se extrae el id de los parametros
    const { id: receiverId } = req.params;
    //obtiene el usuario autentificado para enviar el mensaje 
    const senderId = req.user._id;

    let imageUrl; // aqui almacena la image 
    if (image) {
      //Subiendo imagen a cloudinary si este lo incluye en el chat 
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url; // metodo para que la imagen sea segura
    }
    // creando un nuevo mensaje con lo datos proporcionados
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    // esta se guarda en la base de datos 
    await newMessage.save();

    //Obtiene el socketId  del receptor usando "getReceiverSocketId"
    const receiverSocketId = getReceiverSocketId(receiverId);
    //si el receptor esta conectado recibimos el mensaje en tiempo real 
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    //envia el mensaje recien creado como respuesta al chat 
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error en controlador sendMessages", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
