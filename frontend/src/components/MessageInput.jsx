import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState(""); // Estado para el texto del mensaje
  const [imagePreview, setImagePreview] = useState(null); // Estado para la vista previa de la imagen seleccionada
  const fileInputRef = useRef(null); // Referencia al input para acceder a él desde el DOM
  const { sendMessage } = useChatStore(); // Store para enviar mensajes

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona un archivo de imagen");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result); // Actualiza la vista previa de la imagen
    };
    reader.readAsDataURL(file); // Lee el archivo como una cadena base64 (es decir, como una imagen)
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault(); // Previene el envío por defecto del formulario
    if (!text.trim() && !imagePreview) return; // Si no hay texto ni imagen, no se envía el mensaje

    try {
      await sendMessage({
        text: text.trim(), // Texto del mensaje
        image: imagePreview, // Vista previa de la imagen o null si no hay imagen
      });

      // Limpiar el formulario después de enviar el mensaje
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mn-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange} // Gestiona el cambio de imagen
          />
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()} // Muestra el input de archivo al hacer clic en el botón
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview} // Deshabilita el botón si no hay texto ni imagen
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
