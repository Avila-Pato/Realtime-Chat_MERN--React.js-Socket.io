import { json } from "express";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Todos Los campos son requeridos" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email ya en uso" });
    }
    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    // Generando jwt token y guardando al usuario
    if (newUser) {
      generateToken(newUser._id, res); 
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Datos de usuario inválidos" });
    }
  } catch (error) {
    console.log("Error en el controlador de registro", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const login = async (req, res) => {
  const {email, password} = req.body;

  try {
    // Buscar al usuario en la base de datos por su correo electrónico
    const user = await User.findOne({ email})

    if(!user) {
      return res.status(400).json({message: "Invalidas credenciales"})
    }
     // Verificar si la contraseña proporcionada coincide con la almacenada en la base de datos
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if(!isPasswordCorrect){
      return res.status(400).json({ message: "Credenciales invalidas"})
    }
     // Si la autenticación es exitosa, generamos un token JWT para el usuario
    generateToken(user._id, res);

    // Devolvemos la información del usuario como respuesta
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    })
  } catch (error) {
    console.log("Error en los controladores", error.message)
    res.status(500),json({ message: "Error interno del servidor"})
  }
};


export const logout = (req, res) => {
  try {
      // Eliminar la cookie "jwt" para cerrar la sesión
    res.cookie("jwt", "", {maxAge: 0});
    // Responder al cliente indicando que la desconexión fue exitosa
    res.status(200).json({ message: "Desconectado exitosamente"})
  } catch (error) {
    console.log("Error en los controladores", error.message)
    res.status(500),json({ message: "Error interno del servidor"})
  }
};

export const updateProfile = async (req, res) => {
  try {
    // Obtener la URL de la imagen de perfil desde el cuerpo de la solicitud
    const { profilePic } = req.body;
    // Obtener el ID del usuario desde `req.user._id`
    const userId = req.user._id

    if(!profilePic) {
      return res.status(400).json({ message: "Se requiere una imagen de perfil"})
    }
       // Subida de la imagen a Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    // Actualizar el usuario en la base de datos con la nueva URL de la imagen de perfil
    const updateUser = await User.findByIdAndUpdate(
      userId,
       // URL segura de la imagen subida a Cloudinary
      {profilePic: uploadResponse.secure_url},
       // Devuelve el documento actualizado
      {new: true}
    );
    res.status(200).json(updateUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }

}