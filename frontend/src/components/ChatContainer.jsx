import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
 const {
    messages, // Mensajes cargados desde el store
    getMessages, // Función para cargar mensajes
    isMessagesLoading, // Estado de carga de mensajes
    selectedUser, // Usuario seleccionado para el chat
    subscribeToMessages, // Función para suscribirse a mensajes
    unsubscribeFromMessages, // Función para desuscribirse de mensajes
 } = useChatStore();


const {authUser} = useAuthStore() //  hook del estado global para la autntificacion
const messageEndRef = useRef(null)  // Referencia para el elemento donde se debe hacer scroll al último mensaje y no quede arriba el texto



useEffect(() => {
    getMessages(selectedUser._id) // carga los mensajes cuando se selecciona el usuario

    subscribeToMessages() // se conecta al canal para recibir el mensaje

    return () => unsubscribeFromMessages() // limpia el canal cuando el usuario cierra el canal
},[selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages])
useEffect(() => {
    // Desplazamiento automático a la última posición de mensaje
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    // Muestra el esqueleto de carga mientras se están cargando los mensajes
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }


  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef} // Referencia para scroll a la última posición
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {/* // Formateo de la hora del mensaje */}
                {formatMessageTime(message.createdAt)} 
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput /> {/* Componente de entrada de mensajes */}
    </div>
  );
};

export default ChatContainer