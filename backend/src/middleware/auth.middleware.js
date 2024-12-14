// El middleware protectRoute se encarga de verificar si un usuario está autenticado 
// y si tiene un token JWT válido antes de permitir el acceso a rutas protegidas en la aplicación.
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const protectRoute = async (req, res, next) => {
  try {
    // Obtener el token JWT de las cookies
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    // Verificar el token usando el secreto definido en .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    // Buscar al usuario asociado al token decodificado
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Asignar el usuario encontrado al request
    req.user = user;

    // Continuar con la ejecución del siguiente middleware o ruta
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
