import jwt from "jsonwebtoken"; //métodos para crear y verificar JWT.

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { // Payload: Se pasa un objeto { userId } que es un objeto JSON con la información que quieres incluir en el token.
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //  cookie a 7 días en milisegundos. para expiracion
    httpOnly: true, // Hace que la cookie solo sea accesible a través de HTTP, protegiendo contra ataques de Cross-Site Scripting (XSS).
    sameSite: "strict",  // Previene ataques de Cross-Site Request Forgery (CSRF).
    secure: process.env.NODE_ENV !== "development", //  Hace que la cookie solo sea enviada en conexiones HTTPS, lo cual es importante para seguridad en producción.
  });

  return token;
};