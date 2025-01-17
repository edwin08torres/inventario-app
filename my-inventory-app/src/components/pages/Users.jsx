/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/AuthContext";

const baseURL = "/api/users";

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded relative min-w-[300px]">
        <button
          className="absolute top-2 right-2 text-xl font-bold"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

const UsersPage = () => {
  const { user: loggedUser } = useContext(AuthContext);

  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);

  // Form
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "user",
    enabled: true,
  });

  // Búsqueda
  const [search, setSearch] = useState("");

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Modal
  const [showModal, setShowModal] = useState(false);

  // Cálculo de paginación local
  const totalItems = users.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = users.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Cargar todos los usuarios
  const fetchAllUsers = async () => {
    try {
      const { data } = await axios.get(baseURL);
      setAllUsers(data);
      setUsers(data);
      setCurrentPage(1);
    } catch (error) {
      toast.error("Error al cargar usuarios");
    }
  };

  useEffect(() => {
    if (loggedUser?.role === "admin") {
      fetchAllUsers();
    }
  }, [loggedUser]);

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
      setCurrentPage(1);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const handleSearchClick = () => {
    filterUsers(search);
  };
  const handleClearFilter = () => {
    setSearch("");
    setUsers(allUsers);
    setCurrentPage(1);
  };

  // Habilitar/Deshabilitar
  const toggleEnableUser = async (id, newStatus) => {
    try {
      await axios.patch(`${baseURL}/${id}`, { enabled: newStatus });
      toast.success(`Usuario ${newStatus ? "habilitado" : "deshabilitado"}`);
      fetchAllUsers();
    } catch (error) {
      toast.error("Error al actualizar usuario");
    }
  };

  // Abrir modal para Crear
  const openCreateModal = () => {
    setEditingUser(null);
    setForm({ username: "", password: "", role: "user", enabled: true });
    setShowModal(true);
  };

  // Abrir modal para Editar
  const handleEdit = (u) => {
    setEditingUser(u);
    setForm({
      username: u.username,
      password: u.password,
      role: u.role,
      enabled: u.enabled,
    });
    setShowModal(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false);
  };

  const handleCancel = () => {
    setEditingUser(null);
    setForm({ username: "", password: "", role: "user", enabled: true });
    setShowModal(false);
  };

  // Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Editar
        await axios.put(`${baseURL}/${editingUser.id}`, {
          username: form.username,
          password: form.password,
          role: form.role,
          enabled: form.enabled,
        });
        toast.success("Usuario actualizado");
      } else {
        // Crear
        await axios.post(baseURL, {
          username: form.username,
          password: form.password,
          role: form.role,
          enabled: form.enabled,
        });
        toast.success("Usuario creado");
      }
      fetchAllUsers();
      setShowModal(false);
      setEditingUser(null);
      setForm({ username: "", password: "", role: "user", enabled: true });
    } catch (error) {
      toast.error("Error al guardar el usuario");
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  if (loggedUser?.role !== "admin") {
    return <div className="p-6">No tienes permisos para ver esta sección.</div>;
  }

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

      <div className="mb-4 flex items-center space-x-2">
        <label>Items por página:</label>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </div>

      {/* Botón Crear */}
      <button
        onClick={openCreateModal}
        className="mb-4 px-3 py-1 bg-green-600 text-white rounded"
      >
        Crear Usuario
      </button>

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
          {currentData.map((u) => (
            <tr key={u.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{u.id}</td>
              <td className="px-4 py-2">{u.username}</td>
              <td className="px-4 py-2">{u.role}</td>
              <td className="px-4 py-2">
                {u.enabled ? "Habilitado" : "Deshabilitado"}
              </td>
              <td className="px-4 py-2">
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

      <div className="flex items-center mt-4 space-x-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>

      {/* Modal de Crear/Editar */}
      {showModal && (
        <Modal onClose={closeModal}>
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
        </Modal>
      )}
    </div>
  );
};

export default UsersPage;
