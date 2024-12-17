import axios from "axios";

// Creaa una instancia personalizada de Axios con configuraciones 
// predefinidas.
export const axiosInstance = axios.create({
  // Configura la baseURL dependiendo del entorno en el que estemos.
  baseURL:
    import.meta.env.MODE === "development"
      ? // En modo desarrollo, usamos el servidor local.
        "http://localhost:5001/api"
      : // En producción, usamos la ruta relativa "/api".
        "/api",

  // Habilitamos el envío de cookies y encabezados de autenticación con las solicitudes.
  withCredentials: true,
});

//manejar múltiples entornos (desarrollo y producción).
// La configuración dinámica de baseURL y el uso de withCredentials
//  facilita el trabajo con APIs y autenticación.
