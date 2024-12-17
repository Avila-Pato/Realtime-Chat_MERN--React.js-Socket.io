import { Server } from "socket.io";  // Socket.IO para manejo de conexiones en tiempo real
import http from "http"; // Módulo HTTP de Node.js para crear el servidor
import express from "express"; // Express para manejar rutas y solicitudes HTTP

//crea la instancia apra express
const app = express();

// crea el servidor HTTP usando la isntancia express
const server = http.createServer(app);

// Inicia el servidor socket-IO i lo vincula al ervidor http
const io = new Server(server, {
    //configura cors apra un cliente especifico
  cors: {
    origin: ["http://localhost:5173"],
    
  },
});
// Obtiene el coket id del usaurio conectado por el userId
export function getReceiverSocketId(userId) {
  // devuele el socketid correspondiente al userId
  return userSocketMap[userId]; 
}

//mapa de usuarios coenctados
const userSocketMap = {}; // {userId: socketId}

// Configuraa los eventos para manejarlos 
io.on("connection", (socket) => {
  console.log("Usuario Conectados", socket.id); // muestra los usuarios conectados

  //Obtiene al user por su id desde sus aprametris query.userId
  const userId = socket.handshake.query.userId;
  // si sus parametros son agregados,e ste se agrega al mapade usuarios coenctados
  if (userId) userSocketMap[userId] = socket.id;

  // Desde aqui los envie a la lista y actualiza los usuarios en linea 
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Manajando evento si un usuario se desconecta
  socket.on("disconnect", () => {
    console.log("Usuario Desconectado", socket.id);
    // Elimina al usaurio de la lsita online
    delete userSocketMap[userId];
    // y aqui nuevamente actualiza la lista osea el mapa
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// exporta todas las instancias necesarias para usarlas en otras partes de la aplicación
export { io, app, server };