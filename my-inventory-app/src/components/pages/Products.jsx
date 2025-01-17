/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const baseURL = "/api/Products";

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

const ProductsPage = () => {
  const { user } = useContext(AuthContext);

  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    categoryId: 0,
    price: 0,
    stock: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Modal
  const [showModal, setShowModal] = useState(false);

  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = products.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Carga inicial
  useEffect(() => {
    fetchAllProducts();
    fetchCategories();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const { data } = await axios.get(baseURL);
      setAllProducts(data);
      setProducts(data);
      setCurrentPage(1);
    } catch (error) {
      toast.error("Error al cargar productos");
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/categories"); 
      setCategories(data);
    } catch (error) {
      toast.error("Error al cargar categorías");
    }
  };

  const filterProducts = (term) => {
    if (!term.trim()) {
      toast.warn("Ingresa un término para buscar");
      return;
    }
    const lowerTerm = term.toLowerCase();
    const filtered = allProducts.filter((p) =>
      p.name.toLowerCase().includes(lowerTerm)
    );
    if (filtered.length === 0) {
      toast.error("Producto no encontrado");
    } else {
      toast.success("Producto encontrado");
      setProducts(filtered);
      setCurrentPage(1);
    }
  };

  // Handlers de búsqueda
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const handleSearchClick = () => {
    filterProducts(search);
  };
  const handleClearFilter = () => {
    setSearch("");
    setProducts(allProducts);
    setCurrentPage(1);
  };

  // Abrir modal (Crear)
  const openCreateModal = () => {
    setEditingProduct(null);
    setForm({ name: "", categoryId: 0, price: 0, stock: 0 });
    setShowModal(true);
  };

  // Abrir modal (Editar)
  const handleEdit = (prod) => {
    setEditingProduct(prod);
    setForm({
      name: prod.name,
      categoryId: prod.categoryId,
      price: prod.price,
      stock: prod.stock,
    });
    setShowModal(true);
  };

  // Cerrar Modal
  const closeModal = () => {
    setShowModal(false);
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setForm({ name: "", categoryId: 0, price: 0, stock: 0 });
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, categoryId, price, stock } = form;

    // Validaciones mínimas
    if (!name.trim() || !categoryId) {
      toast.error("Campos requeridos vacíos");
      return;
    }
    if (price < 0) {
      toast.error("El precio no puede ser negativo");
      return;
    }
    if (stock < 0) {
      toast.error("El stock no puede ser negativo");
      return;
    }

    try {
      if (editingProduct) {
        // PUT -> editar
        await axios.put(`${baseURL}/${editingProduct.id}`, form);
        toast.success("Producto actualizado");
      } else {
        // POST -> crear
        await axios.post(baseURL, form);
        toast.success("Producto creado");
      }
      await fetchAllProducts();
      setShowModal(false);
      setEditingProduct(null);
      setForm({ name: "", categoryId: 0, price: 0, stock: 0 });
    } catch (error) {
      toast.error("Error al guardar el producto");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    try {
      await axios.delete(`${baseURL}/${id}`);
      toast.success("Producto eliminado");
      await fetchAllProducts();
    } catch (error) {
      toast.error("Error al eliminar producto");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (!user) return null; 

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Productos</h2>

      {/* Barra de búsqueda */}
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Buscar producto..."
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

      {/* Botón Crear (solo admin) */}
      {user?.role === "admin" && (
        <button
          onClick={openCreateModal}
          className="mb-4 px-3 py-1 bg-green-600 text-white rounded"
        >
          Crear Producto
        </button>
      )}

      <table className="min-w-full bg-white rounded shadow mb-8">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Categoría</th>
            <th className="px-4 py-2">Precio</th>
            <th className="px-4 py-2">Stock</th>
            {user?.role === "admin" && <th className="px-4 py-2">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {currentData.map((p) => {
            const categoryName =
              categories.find((c) => c.id === p.categoryId)?.name || "";
            return (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{p.id}</td>
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">{categoryName}</td>
                <td className="px-4 py-2">{p.price}</td>
                <td className="px-4 py-2">{p.stock}</td>
                {user?.role === "admin" && (
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Botones de paginación */}
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
            {editingProduct ? "Editar Producto" : "Nuevo Producto"}
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
                Categoría
              </label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="border w-full px-3 py-2 rounded"
                required
              >
                <option value={0}>Seleccione</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Precio
              </label>
              <input
                type="number"
                name="price"
                min="0"
                value={form.price}
                onChange={handleChange}
                className="border w-full px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                min="0"
                value={form.stock}
                onChange={handleChange}
                className="border w-full px-3 py-2 rounded"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                {editingProduct ? "Actualizar" : "Crear"}
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

export default ProductsPage;
