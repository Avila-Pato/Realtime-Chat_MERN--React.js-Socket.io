import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
// import { io } from "socket.io-client";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false, 
    isLoggingIn: false, 
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/api/check");
            set({ authUser: res.data });
        } catch (error) {
            console.log("Error en CheckAuth", error);
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    ///SIGNUP
    signup: async( data ) => {
        set({isSigningUp: true})
        try{
            const res = await axiosInstance.post("/auth/signup", data)
            set({ authUser: res.data })
            toast.success("Account created successfully");
            get().connectSocket();
        }catch(error) {
            toast.error(error.response.data.message);
        }finally {
            set({isSigningUp: false})
        }
    }

}));
