import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors';
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();
const PORT = process.env.PORT;

// Configuración CORS
const corsOptions = {
  origin: 'http://localhost:5173', // Dirección del frontend
  credentials: true, // Permite que se envíen cookies con la solicitud
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'], // Encabezados permitidos adicionales
  exposedHeaders: ['Set-Cookie'] // Encabezados que se expondrán al cliente
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Para parsear JSON en el cuerpo de las solicitudes
app.use(cookieParser()); // Habilitar el middleware de cookies
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  connectDB();
});
