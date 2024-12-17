
import axios from "axios";

// Creamos una instancia personalizada de Axios con configuraciones predefinidas.
export const axiosInstance = axios.create({
  // Configuramos la baseURL dependiendo del entorno en el que estemos.
  baseURL: import.meta.env.MODE === "development" 
    ? "http://localhost:5001/api" // En modo desarrollo, usamos el servidor local.
    : "/api", // En producción, usamos la ruta relativa "/api".

  // Habilitamos el envío de cookies y encabezados de autenticación con las solicitudes.
  withCredentials: true,
});
