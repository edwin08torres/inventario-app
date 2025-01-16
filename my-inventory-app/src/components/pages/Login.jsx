/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { login as loginService } from "../../api/auth";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { handleLogin } = useContext(AuthContext);
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate(); // Hook de React Router
  
  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginService(form.username, form.password);
      handleLogin(response); 
      toast.success("Sesión iniciada exitosamente!");
      // Redirigir al Home ("/" en este caso)
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h2 className="mb-6 text-2xl font-bold text-center">Iniciar Sesión</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Usuario</label>
            <input
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
              type="text"
              name="username"
              value={form.username}
              onChange={onChange}
              placeholder="Ingresa tu usuario"
              required
            />
          </div>
          {/* Password */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Contraseña</label>
            <input
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
