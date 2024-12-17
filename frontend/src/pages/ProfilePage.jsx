import { useState } from "react"; 
import { useAuthStore } from "../store/useAuthStore"; 
import { Camera, Mail, User } from "lucide-react"; 

const ProfilePage= () => {
   // Extrae al usuario autenticado o no de la store para actualizar el perfil
   const { authUser, isUpdatingProfile, updateProfile } = useAuthStore()

   // Se crea un estado local para almacenar la imagen
   const [selectedImg, setSelectImg ] = useState(null)

   // Función para manejar la carga de imagen. Será asincrona porque trabajará con datos.
   const handleImageUpload = async (e) => {
      const file = e.target.files[0]; // Toma el primer archivo seleccionado
      if (!file) return; // Si no se selecciona ningún archivo, termina la función

      const reader = new FileReader(); // Crea una instancia de FileReader
      reader.readAsDataURL(file); // Convierte el archivo a formato base64

      reader.onload = async () => { // Una vez que la imagen esté convertida
         const base64Image = reader.result; // Guarda el resultado
         setSelectImg(base64Image); // Actualiza el estado local de la imagen con la imagen seleccionada del usuario
         await updateProfile({ profilePic: base64Image }); // Llama a la función para actualizar la imagen
      }
   }

   return (
      <div className="h-screen pt-20">
        {/* Contenedor principal */}
        <div className="max-w-2xl mx-auto p-4 py-8">
          <div className="bg-base-300 rounded-xl p-6 space-y-8">
            {/* Encabezado de la sección */}
            <div className="text-center">
              <h1 className="text-2xl font-semibold ">Profile</h1>
              <p className="mt-2">Your profile information</p>
            </div>
  
            {/* Sección para subir avatar */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {/* Muestra la imagen seleccionada, la imagen del usuario o una por defecto */}
                <img
                  src={selectedImg || authUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4"
                />
                {/* Botón de carga de imagen */}
                <label
                  htmlFor="avatar-upload"
                  className={`
                    absolute bottom-0 right-0 
                    bg-base-content hover:scale-105
                    p-2 rounded-full cursor-pointer 
                    transition-all duration-200
                    ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                  `}
                >
                  <Camera className="w-5 h-5 text-base-200" /> {/* Ícono de cámara */}
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden" // Esconde el input de tipo file.
                    accept="image/*" // Solo acepta imágenes.
                    onChange={handleImageUpload} // Ejecuta la función al seleccionar una imagen.
                    disabled={isUpdatingProfile} // Desactiva el input si se está subiendo la imagen.
                  />
                </label>
              </div>
              {/* Mensaje para el usuario */}
              <p className="text-sm text-zinc-400">
                {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
              </p>
            </div>
  
            {/* Información del usuario */}
            <div className="space-y-6">
              {/* Nombre completo */}
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <User className="w-4 h-4" /> {/* Ícono de usuario */}
                  Full Name
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {authUser?.fullName} {/* Muestra el nombre del usuario */}
                </p>
              </div>
  
              {/* Dirección de correo */}
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> {/* Ícono de correo */}
                  Email Address
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {authUser?.email} {/* Muestra el correo electrónico del usuario */}
                </p>
              </div>
            </div>
  
            {/* Información adicional */}
            <div className="mt-6 bg-base-300 rounded-xl p-6">
              <h2 className="text-lg font-medium mb-4">Account Information</h2>
              <div className="space-y-3 text-sm">
                {/* Fecha de creación de la cuenta */}
                <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                  <span>Miembro desde</span>
                  <span>{authUser.createdAt?.split("T")[0]}</span> {/* Fecha sin la hora */}
                </div>
                {/* Estado de la cuenta */}
                <div className="flex items-center justify-between py-2">
                  <span>Account Status</span>
                  <span className="text-green-500">Active</span> {/* Estado activo */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
export default ProfilePage;
