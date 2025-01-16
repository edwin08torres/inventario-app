/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const baseURL = "http://localhost:4000";

const CategoriesPage = () => {
  const { user } = useContext(AuthContext);

  const [allCategories, setAllCategories] = useState([]);
  const [categories, setCategories] = useState([]);

  // Formulario
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingCategory, setEditingCategory] = useState(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    try {
      const { data } = await axios.get(`${baseURL}/categories`);
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
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setForm({ name: "", description: "" });
  };

  // Crear / Actualizar categoría
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        // Editar
        await axios.put(`${baseURL}/categories/${editingCategory.id}`, form);
        toast.success("Categoría actualizada");
      } else {
        // Crear
        await axios.post(`${baseURL}/categories`, form);
        toast.success("Categoría creada");
      }

      await fetchAllCategories(); 

      setEditingCategory(null);
      setForm({ name: "", description: "" });
    } catch (error) {
      toast.error("Error al guardar la categoría");
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setForm({ name: category.name, description: category.description });
  };

  // Eliminar
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta categoría?")) return;
    try {
      await axios.delete(`${baseURL}/categories/${id}`);
      toast.success("Categoría eliminada");

      await fetchAllCategories();
      // filterCategories(search);
    } catch (error) {
      toast.error("Error al eliminar la categoría");
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

      {/* Tabla de categorías */}
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
          {categories.map((cat) => (
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

      {/* Formulario para crear / editar, solo para admin */}
      {user?.role === "admin" && (
        <div className="max-w-md bg-white p-4 rounded shadow">
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
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
