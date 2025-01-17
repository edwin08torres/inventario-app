/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/categories";

const CategoriesPage = () => {
  const { user } = useContext(AuthContext);

  const [allCategories, setAllCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setAllCategories(data);
      setCategories(data);
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

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setForm({ name: cat.name, description: cat.description });
    setShowModal(true);
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setForm({ name: "", description: "" });
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!form.name.trim()) {
      toast.error("El nombre de la categoría no puede estar vacío");
      return;
    }
    if (!form.description.trim()) {
      toast.error("La descripción no puede estar vacía");
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, form);
        toast.success("Categoría actualizada");
      } else {
        await createCategory(form);
        toast.success("Categoría creada");
      }
      fetchCategories();
      handleCancel();
    } catch (error) {
      toast.error("Error al guardar la categoría");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta categoría?")) return;
    try {
      await deleteCategory(id);
      toast.success("Categoría eliminada");
      fetchCategories();
    } catch (error) {
      toast.error("Error al eliminar la categoría");
    }
  };

  // Paginación lógica
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const displayedCategories = categories.slice(
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
    setCurrentPage(1); // Reinicia la paginación al cambiar el tamaño
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
        {/* Botón para abrir el modal */}
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Crear Categoría
        </button>
      </div>

      {/* Tabla de categorías */}
      <table className="min-w-full bg-white rounded shadow mb-8">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Descripción</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {displayedCategories.map((cat) => (
            <tr key={cat.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{cat.id}</td>
              <td className="px-4 py-2">{cat.name}</td>
              <td className="px-4 py-2">{cat.description}</td>
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
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación y selector de elementos por página */}
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
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="border w-full px-3 py-2 rounded"
                  rows={3}
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

export default CategoriesPage;
