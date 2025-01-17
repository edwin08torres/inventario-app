/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { getUsers, createUser, updateUser, deleteUser } from "../../api/users";

const UsersPage = () => {
  const { user: loggedUser } = useContext(AuthContext);

  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "user",
    enabled: true,
  });
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    if (loggedUser?.role === "admin") {
      fetchUsers();
    }
  }, [loggedUser]);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
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
      setCurrentPage(1);
    }
  };

  const handleSearchChange = (e) => setSearch(e.target.value);

  const handleSearchClick = () => filterUsers(search);

  const handleClearFilter = () => {
    setSearch("");
    setUsers(allUsers);
    setCurrentPage(1);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({ ...user });
    setShowModal(true);
  };

  const handleCancel = () => {
    setEditingUser(null);
    setForm({ username: "", password: "", role: "user", enabled: true });
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!form.username.trim()) {
      toast.error("El nombre de usuario no puede estar vacío");
      return;
    }
    if (!form.password.trim()) {
      toast.error("La contraseña no puede estar vacía");
      return;
    }
    if (!["admin", "user"].includes(form.role)) {
      toast.error("El rol debe ser válido (admin o user)");
      return;
    }

    try {
      if (editingUser) {
        await updateUser(editingUser.id, form);
        toast.success("Usuario actualizado");
      } else {
        await createUser(form);
        toast.success("Usuario creado");
      }
      fetchUsers();
      handleCancel();
    } catch (error) {
      toast.error("Error al guardar el usuario");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    try {
      await deleteUser(id);
      toast.success("Usuario eliminado");
      fetchUsers();
    } catch (error) {
      toast.error("Error al eliminar el usuario");
    }
  };

  // Paginación lógica
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const displayedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
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

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Crear Usuario
        </button>
      </div>

      {/* Tabla de usuarios */}
      <table className="min-w-full bg-white rounded shadow mb-8">
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
          {displayedUsers.map((u) => (
            <tr key={u.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{u.id}</td>
              <td className="px-4 py-2">{u.username}</td>
              <td className="px-4 py-2">{u.role}</td>
              <td className="px-4 py-2">
                {u.enabled ? "Habilitado" : "Deshabilitado"}
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleEdit(u)}
                  className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="mb-4 flex justify-between items-center">
        <div>
          <label className="mr-2 font-medium">Items por página:</label>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border rounded px-2 py-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>
        <div>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Anterior
          </button>
          <span className="mx-2">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
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
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
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
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="border w-full px-3 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Rol
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
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
                  onChange={(e) =>
                    setForm({ ...form, enabled: e.target.checked })
                  }
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
