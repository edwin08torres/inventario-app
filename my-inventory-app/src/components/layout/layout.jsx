/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Ajusta la ruta de AuthContext según tu estructura
import { AuthContext } from "../../contexts/AuthContext";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Manejamos logout desde el contexto
  const { handleLogout } = useContext(AuthContext);

  // Para redirigir después de logout
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const onLogout = () => {
    handleLogout();
    toast.success("Sesión terminada con éxito");
    navigate("/login");
  };

  return (
    <div className="flex h-screen">
      <button
        className="absolute top-1 left-1 lg:hidden z-40 
                   bg-blue-600 text-white p-2 rounded"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? "Cerrar" : "Menú"}
      </button>
      
      {/* Sidebar */}
      <aside
        className={`
          bg-gray-800 text-white
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0
          transform top-0 left-0 w-64 h-full fixed
          lg:static lg:flex-shrink-0
          transition-transform duration-200
          z-30
        `}
      >
        {/* Navegación lateral */}
        <nav className="flex flex-col p-4 mt-10 md:mt-10">
          <Link to="/" className="py-2 hover:bg-gray-700 rounded">
            Inicio
          </Link>
          <Link to="/users" className="py-2 hover:bg-gray-700 rounded">
            Usuarios
          </Link>
          <Link to="/categories" className="py-2 hover:bg-gray-700 rounded">
            Categorías
          </Link>
          <Link to="/products" className="py-2 hover:bg-gray-700 rounded">
            Productos
          </Link>
        </nav>

        {/* Sección superior/dentro del sidebar para el botón Logout */}
        <div className="absolute bottom-4  mt-auto p-4">
          <button
            onClick={onLogout}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 bg-gray-100 ml-0">
        {children}
      </main>
    </div>
  );
};

export default Layout;
