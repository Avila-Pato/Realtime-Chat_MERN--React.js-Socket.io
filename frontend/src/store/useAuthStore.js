import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// Definir la URL base dependiendo del entorno de desarrollo
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null, // Representa el usuario autenticado. Inicialmente es null.
    //Inicialmente, su valor es null porque no hay ningún usuario autenticado al cargar la aplicación.
    isSigningUp: false, // Indica si el usuario está en el proceso de registrarse. Inicialmente es false.
    isLoggingIn: false, // Indica si el usuario está en el proceso de iniciar sesión. Inicialmente es false.
    isUpdatingProfile: false, // Indica si el usuario está actualizando su perfil. Inicialmente es false.
    isCheckingAuth: true, // Indica si la aplicación está verificando la autenticación del usuario. Por defecto es true.

    // Verificar autenticación
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
        } catch (error) {
            console.log("Error en CheckAuth", error);
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    // Lógica de SIGNUP
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
            get().connectSocket(); // Llama a la función connectSocket para conectar el socket
        } catch (error) {
            toast.error(error.response?.data?.message || "Error al crear cuenta");
        } finally {
            set({ isSigningUp: false });
        }
    },

    // Lógica de LOGIN
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");

            get().connectSocket(); // Llama a la función connectSocket para conectar el socket
        } catch (error) {
            toast.error(error.response?.data?.message || "Error al iniciar sesión");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    // Lógica de LOGOUT
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket(); // Llama a la función disconnectSocket para desconectar el socket
        } catch (error) {
            toast.error(error.response?.data?.message || "Error al cerrar sesión");
        }
    },

    // Lógica para actualizar el perfil
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Perfil actualizado correctamente");
        } catch (error) {
            console.log("Error en la actualización del perfil:", error);
            toast.error(error.response?.data?.message || "Error al actualizar perfil");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    // Función para conectar el socket
    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
        });
        socket.connect();

        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },

    // Función para desconectar el socket
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}));
