import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";// Icono de usuarios 

const SideBar = () => {
    // Destructuración de los estados y funciones proporcionados por los hooks personalizados
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();

  const { onlineUsers } = useAuthStore(); // Usuarios online
  const [showOnlineOnly, setShowOnlineOnly] = useState(false); // estado local para mostar los usuarios en linea

//  llama a getAUsers cuando el componente se monta
  useEffect(() => {
    getUsers(); // obtiene la lista de usuarios
  }, [getUsers]);

  // Filtro de usuarios para mostrar solo aquellos que están en línea si showOnlineOnly es true
  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user.id)) //true
    : users; // false

    // Si los usuarios están cargando, muestra el esqueleto de la barra lateral
  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" /> {/* Icono de usuarios */}
          <span className="font-medium hidden lg:block">Contactos</span>
        </div>

        {/* Control de filtros para mostrar solo usuarios en línea */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)} // Cambio de estado del filtro
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Conectados</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>
            {/* Muestra de los usuarios filtrados */}
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => {
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${
                  selectedUser?._id === user._id
                    ? "bg-base-300 ring-1 ring-base-300"
                    : ""
                }
              `}
          >
            {/* Avatar del usuario */}
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                        rounded-full ring-2 ring-zinc-900"
                ></span>
              )}
            </div>

            {/* Informaciond e usuario solo en pantallas grandes */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>;
        })}
        {/* Muestra un mensaje si no hay usuarios en línea */}
        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};

export default SideBar;
