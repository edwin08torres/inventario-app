/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/AuthContext";

const baseURL = "http://localhost:4000";

const UsersPage = () => {
  const { user: loggedUser } = useContext(AuthContext);

  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);

  // Formulario
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "user",
    enabled: true,
  });

  // Búsqueda
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (loggedUser?.role === "admin") {
      fetchAllUsers();
    }
  }, [loggedUser]);

  // Carga todos los usuarios desde JSON Server
  const fetchAllUsers = async () => {
    try {
      const { data } = await axios.get(`${baseURL}/users`);
      setAllUsers(data);  
      setUsers(data);    
    } catch (error) {
      toast.error("Error al cargar usuarios");
    }
  };

  const filterUsers = (term) => {
    if (!term.trim()) {
      toast.warn("Ingresa un término para buscar");
      return;
    }
    const lowerTerm = term.toLowerCase();
    const filtered = allUsers.filter((u) =>
      u.username.toLowerCase().includes(lowerTerm)
    );
    if (filtered.length === 0) {
      toast.error("Usuario no encontrado");
    } else {
      toast.success("Usuario(s) encontrado(s)");
      setUsers(filtered);
    }
  };

  // Botón "Buscar"
  const handleSearchClick = () => {
    filterUsers(search);
  };

  // Botón "Borrar Filtro"
  const handleClearFilter = () => {
    setSearch("");
    setUsers(allUsers);  
  };

  // Cada vez que el input de búsqueda cambie
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Habilitar/Deshabilitar usuario
  const toggleEnableUser = async (id, newStatus) => {
    try {
      await axios.patch(`${baseURL}/users/${id}`, { enabled: newStatus });
      toast.success(`Usuario ${newStatus ? "habilitado" : "deshabilitado"}`);
      fetchAllUsers();
    } catch (error) {
      toast.error("Error al actualizar usuario");
    }
  };

  // Verificar si es admin
  if (loggedUser?.role !== "admin") {
    return <div className="p-6">No tienes permisos para ver esta sección.</div>;
  }

  // Crear o editar un usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Editar
        await axios.put(`${baseURL}/users/${editingUser.id}`, {
          username: form.username,
          password: form.password,
          role: form.role,
          enabled: form.enabled,
        });
        toast.success("Usuario actualizado");
      } else {
        // Crear
        await axios.post(`${baseURL}/users`, {
          username: form.username,
          password: form.password,
          role: form.role,
          enabled: form.enabled,
        });
        toast.success("Usuario creado");
      }
      await fetchAllUsers();

      // Limpia
      setEditingUser(null);
      setForm({ username: "", password: "", role: "user", enabled: true });
    } catch (error) {
      toast.error("Error al guardar el usuario");
    }
  };

  // Manejo de inputs en el form
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Cancelar edición
  const handleCancel = () => {
    setEditingUser(null);
    setForm({ username: "", password: "", role: "user", enabled: true });
  };

  // Cargar datos para editar
  const handleEdit = (u) => {
    setEditingUser(u);
    setForm({
      username: u.username,
      password: u.password,
      role: u.role,
      enabled: u.enabled,
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>

      {/* Barra de búsqueda */}
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={search}
          onChange={handleSearchChange}
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={handleSearchClick}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Buscar
        </button>
        <button
          onClick={handleClearFilter}
          className="px-3 py-1 bg-gray-400 text-white rounded"
        >
          Borrar Filtro
        </button>
      </div>

      {/* Tabla de usuarios */}
      <table className="min-w-full bg-white rounded shadow overflow-x-auto text-sm sm:text-base">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">Rol</th>
            <th className="px-4 py-2">Estado</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{u.id}</td>
              <td className="px-4 py-2">{u.username}</td>
              <td className="px-4 py-2">{u.role}</td>
              <td className="px-4 py-2">
                {u.enabled ? "Habilitado" : "Deshabilitado"}
              </td>
              <td className="px-4 py-2">
                {/* Habilitar/Deshabilitar */}
                <button
                  onClick={() => toggleEnableUser(u.id, !u.enabled)}
                  className={`px-2 py-1 rounded mr-2 ${
                    u.enabled ? "bg-red-500" : "bg-green-500"
                  } text-white`}
                >
                  {u.enabled ? "Deshabilitar" : "Habilitar"}
                </button>
                
                {/* Editar */}
                <button
                  onClick={() => handleEdit(u)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form para crear/editar usuario */}
      <div className="max-w-md bg-white p-4 rounded shadow mt-6">
        <h3 className="text-xl font-bold mb-4">
          {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Nombre de Usuario
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleFormChange}
              className="border w-full px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleFormChange}
              className="border w-full px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Rol</label>
            <select
              name="role"
              value={form.role}
              onChange={handleFormChange}
              className="border w-full px-3 py-2 rounded"
              required
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="font-medium text-gray-700">Habilitado</label>
            <input
              type="checkbox"
              name="enabled"
              checked={form.enabled}
              onChange={handleFormChange}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              {editingUser ? "Actualizar" : "Crear"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsersPage;
