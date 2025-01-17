/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const baseURL = "/api/categories";

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

const CategoriesPage = () => {
  const { user } = useContext(AuthContext);

  const [allCategories, setAllCategories] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({ name: "", description: "" });
  const [editingCategory, setEditingCategory] = useState(null);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Para el modal
  const [showModal, setShowModal] = useState(false);

  const totalItems = categories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = categories.slice(startIndex, endIndex);

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    try {
      const { data } = await axios.get(baseURL);
      setAllCategories(data);
      setCategories(data);
      setCurrentPage(1);
    } catch (error) {
      toast.error("Error al cargar categorías");
    }
  };

  const filterCategories = (term) => {
    if (!term.trim()) {
      toast.warn("Ingresa un término para buscar");
      return;
    }
    const lowerTerm = term.toLowerCase();
    const filtered = allCategories.filter((cat) =>
      cat.name.toLowerCase().includes(lowerTerm)
    );

    if (filtered.length === 0) {
      toast.error("Categoría no encontrada");
    } else {
      toast.success("Categoría(s) encontrada(s)");
      setCategories(filtered);
      setCurrentPage(1);
    }
  };

  // Paginación
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Búsqueda
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const handleSearchClick = () => {
    filterCategories(search);
  };
  const handleClearFilter = () => {
    setSearch("");
    setCategories(allCategories);
    setCurrentPage(1);
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setForm({ name: "", description: "" });
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setForm({ name: category.name, description: category.description });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Manejo de form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setForm({ name: "", description: "" });
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta categoría?")) return;
    try {
      await axios.delete(`${baseURL}/${id}`);
      toast.success("Categoría eliminada");
      fetchAllCategories();
    } catch (error) {
      toast.error("Error al eliminar la categoría");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        // Editar
        await axios.put(`${baseURL}/${editingCategory.id}`, form);
        toast.success("Categoría actualizada");
      } else {
        // Crear
        await axios.post(baseURL, form);
        toast.success("Categoría creada");
      }
      fetchAllCategories();
      setShowModal(false);
      setEditingCategory(null);
      setForm({ name: "", description: "" });
    } catch (error) {
      toast.error("Error al guardar la categoría");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Categorías</h2>

      {/* Barra de búsqueda */}
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Buscar categoría..."
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
        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </div>

      {/* Botón "Crear" (solo si admin) */}
      {user?.role === "admin" && (
        <button
          onClick={openCreateModal}
          className="mb-4 px-3 py-1 bg-green-600 text-white rounded"
        >
          Crear Categoría
        </button>
      )}

      {/* Tabla de Categorías */}
      <table className="min-w-full bg-white rounded shadow mb-8">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Descripción</th>
            {user?.role === "admin" && <th className="px-4 py-2">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {currentData.map((cat) => (
            <tr key={cat.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{cat.id}</td>
              <td className="px-4 py-2">{cat.name}</td>
              <td className="px-4 py-2">{cat.description}</td>
              {user?.role === "admin" && (
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Eliminar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Controles de paginación */}
      <div className="flex items-center mb-4 space-x-4">
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
            {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="border w-full px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="border w-full px-3 py-2 rounded"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                {editingCategory ? "Actualizar" : "Crear"}
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={handleCancel}
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

export default CategoriesPage;
