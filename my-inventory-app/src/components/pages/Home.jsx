/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bienvenido al Panel de Administración</h1>
      <p className="mb-6">Hola, {user?.username}. ¡Aquí puedes gestionar el inventario!</p>

      <div className="grid grid-cols-3 gap-6">
        {/* Si eres admin, puedes ver y gestionar usuarios */}
        {user?.role === "admin" && (
          <Link
            to="/users"
            className="block p-4 bg-blue-600 text-white text-center rounded hover:bg-blue-700"
          >
            Usuarios
          </Link>
        )}
        
        {/* Categorías (ver y CRUD para admin) */}
        <Link
          to="/categories"
          className="block p-4 bg-green-600 text-white text-center rounded hover:bg-green-700"
        >
          Categorías
        </Link>

        {/* Productos (ver y CRUD para admin) */}
        <Link
          to="/products"
          className="block p-4 bg-yellow-600 text-white text-center rounded hover:bg-yellow-700"
        >
          Productos
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
