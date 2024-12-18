import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null, //usuario seleccionado actualmente para el chat
  isUsersLoading: false, // indica si los usuarios staran siendo cargados
  isMessagesLoading: false, // indica si los mensajes staran siendo cargados

  getUsers: async () => { // genera la lista de usuarios
    set({ isUsersLoading: true }); // cambia al estado a true para indicar los usuarios cargados
    try {
      const res = await axiosInstance.get("/messages/users"); // solicitud get para obtener los usuarios
      set({ users: res.data }); // actauliza el estado de los usuarios
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false }); // cabia el estado a false para indicar que la carga de usuarios finalizo
    }
  },

  getMessages: async (userId) => { // obteniendo los mensajes de un usuario especifico
    set({ isMessagesLoading: true }); //  cambia al estado a true para indicar los mensajes cargados
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);// solicitud get para obtener los mensajes
      set({ messages: res.data });// actualiza el estado
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false }); // carga de indicacion que los mensajes terminaron
    }
  },
  sendMessage: async (messageData) => { // funcion para enviar un mensaje al usuario especifico
    const { selectedUser, messages } = get();  // Obtiene el usuario seleccionado y los mensajes actuales del estado.
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);// Realiza una solicitud POST para enviar el mensaje.
      set({ messages: [...messages, res.data] }); // Actualiza el estado añadiendo el mensaje enviado.
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
//   Configurando Sockets
  subscribeToMessages: () => {// Configura un listener(recibe,oyente)  para recibir mensajes en tiempo real.
    const { selectedUser } = get();// Obtiene el usuario seleccionado 
    if (!selectedUser) return; // Si no hay un usuario seleccionado, no configura el listener(recibe,oyente) .

    const socket = useAuthStore.getState().socket; // Obtiene el socket del store de autenticación.

    socket.on("newMessage", (newMessage) => {  // Escucha el evento `newMessage` para recibir nuevos mensajes.
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;  // Verifica si el mensaje proviene del usuario seleccionado.
      if (!isMessageSentFromSelectedUser) return;// Si no es del usuario seleccionado, no lo añade y no envia el mensaje

      set({
          //Por ultimo  Añade el nuevo mensaje al array de mensajes.
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {    // Elimina el listener(recibe,oyente)  de mensajes en tiempo real.
  
    const socket = useAuthStore.getState().socket;   // Obtiene el socket del store de autenticación.
   
    socket.off("newMessage");  // Elimina el listener(recibe,oyente) del evento `newMessage`.
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),  // Establece el usuario seleccionado en el estado.
}));