/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white">
        <nav className="flex flex-col p-4">
          <Link to="/" className="py-2 hover:bg-gray-700 rounded">Inicio</Link>
          <Link to="/users" className="py-2 hover:bg-gray-700 rounded">Usuarios</Link>
          <Link to="/categories" className="py-2 hover:bg-gray-700 rounded">Categorías</Link>
          <Link to="/products" className="py-2 hover:bg-gray-700 rounded">Productos</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
