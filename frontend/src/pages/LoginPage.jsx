
import { useState } from 'react';
import { useAuthStore } from './../store/useAuthStore';
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
const LoginPage= () => {
 const [showPassword, setShowPassword] = useState(false)
 const [formData, setFormData] = useState({
   email: "",
   password: "",
 }) 

 const { login, isLoggingIn } = useAuthStore();

 const handleSubmit = async (e) => {
   e.preventDefault();
   login(formData);
 };
   
 return (
   <div className="h-screen grid lg:grid-cols-2">
     {/* Lado Izquierdo - Formulario */}
     <div className="flex flex-col justify-center items-center p-6 sm:p-12">
       <div className="w-full max-w-md space-y-8">
         {/* Logotipo */}
         <div className="text-center mb-8">
           <div className="flex flex-col items-center gap-2 group">
             <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
               <MessageSquare className="w-6 h-6 text-primary" />
             </div>
             <h1 className="text-2xl font-bold mt-2">¡Bienvenido de nuevo!</h1>
             <p className="text-base-content/60">Inicia sesión en tu cuenta</p>
           </div>
         </div>
 
         {/* Formulario */}
         <form onSubmit={handleSubmit} className="space-y-6">
           <div className="form-control">
             <label className="label">
               <span className="label-text font-medium">Correo Electrónico</span>
             </label>
             <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Mail className="h-5 w-5 text-base-content/40" />
               </div>
               <input
                 type="email"
                 className="input input-bordered w-full pl-10"
                 placeholder="you@example.com"
                 value={formData.email}
                 onChange={(e) => setFormData({ ...formData, email: e.target.value })} // Actualiza el estado `formData` con el valor del correo electrónico
               />
             </div>
           </div>
 
           <div className="form-control">
             <label className="label">
               <span className="label-text font-medium">Contraseña</span>
             </label>
             <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Lock className="h-5 w-5 text-base-content/40" />
               </div>
               <input
                 type={showPassword ? "text" : "password"} // Muestra o esconde la contraseña dependiendo del estado `showPassword`
                 className="input input-bordered w-full pl-10"
                 placeholder="••••••••"
                 value={formData.password}
                 onChange={(e) => setFormData({ ...formData, password: e.target.value })} // Actualiza el estado `formData` con el valor de la contraseña
               />
               <button
                 type="button"
                 className="absolute inset-y-0 right-0 pr-3 flex items-center"
                 onClick={() => setShowPassword(!showPassword)} // Alterna el estado `showPassword`
               >
                 {showPassword ? ( // Muestra el icono de ojo cerrado si `showPassword` es `true`
                   <EyeOff className="h-5 w-5 text-base-content/40" />
                 ) : ( // Muestra el icono de ojo abierto si `showPassword` es `false`
                   <Eye className="h-5 w-5 text-base-content/40" />
                 )}
               </button>
             </div>
           </div>
 
           <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
             {isLoggingIn ? ( // Muestra un spinner y el texto "Cargando..." si está autenticando
               <>
                 <Loader2 className="h-5 w-5 animate-spin" />
                 Cargando...
               </>
             ) : (
               "Iniciar sesión" // Muestra "Iniciar sesión" si no se está autenticando
             )}
           </button>
         </form>
 
         <div className="text-center">
           <p className="text-base-content/60">
             ¿No tienes una cuenta?{" "}
             <Link to="/signup" className="link link-primary">
               Crear cuenta
             </Link>
           </p>
         </div>
       </div>
     </div>
 
     {/* Lado Derecho - Imagen/Patrón */}
     <AuthImagePattern
       title={"¡Bienvenido de nuevo!"}
       subtitle={"Inicia sesión para continuar tus conversaciones y ponerte al día con tus mensajes."}
     />
   </div>
 );
 
}
 
   export default LoginPage