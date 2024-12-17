// auth.route.js
import express from "express";
import multer from 'multer';
import { login, logout, signup, updateProfile, checkAuth } from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";

// Configuración multer
const storage = multer.memoryStorage(); // Almacenar archivos en memoria
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // Ajusta el límite a tus necesidades

// Middleware para manejar la carga de archivos
export const handleImageUpload = upload.single('image'); // Cambia 'image' por el nombre del campo en tu formulario

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Ruta para actualizar el perfil, incluyendo la carga de imágenes
router.put("/update-profile", protectRoute, handleImageUpload, updateProfile);

router.get("/check", protectRoute, checkAuth);

export default router;
