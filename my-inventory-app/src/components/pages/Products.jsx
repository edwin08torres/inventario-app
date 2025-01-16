/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const baseURL = "http://localhost:4000";

const ProductsPage = () => {
  const { user } = useContext(AuthContext);

  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    categoryId: 0,
    price: 0,
    stock: 0,
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState("");

  // Carga inicial
  useEffect(() => {
    fetchAllProducts();
    fetchCategories();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const { data } = await axios.get(`${baseURL}/products`);
      setAllProducts(data);  // Guardas todo
      setProducts(data);     // Muestras todo
    } catch (error) {
      toast.error("Error al cargar productos");
    }
  };

  // Cargar categorías
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${baseURL}/categories`);
      setCategories(data);
    } catch (error) {
      toast.error("Error al cargar categorías");
    }
  };

  // Filtra en memoria (case-insensitive)
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
    }
  };

  // Buscar
  const handleSearchClick = () => {
    filterProducts(search);
  };

  const handleClearFilter = () => {
    setSearch("");
    setProducts(allProducts); 
  };

  // OnChange del search
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Cancelar edición
  const handleCancel = () => {
    setEditingProduct(null);
    setForm({ name: "", categoryId: 0, price: 0, stock: 0 });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Crear/editar producto
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, categoryId, price, stock } = form;

    // Validaciones
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
        await axios.put(`${baseURL}/products/${editingProduct.id}`, form);
        toast.success("Producto actualizado");
      } else {
        await axios.post(`${baseURL}/products`, form);
        toast.success("Producto creado");
      }
      // Refrescar la lista
      await fetchAllProducts(); 

      // Limpia
      setEditingProduct(null);
      setForm({ name: "", categoryId: 0, price: 0, stock: 0 });
    } catch (error) {
      toast.error("Error al guardar el producto");
    }
  };

  // Editar
  const handleEdit = (prod) => {
    setEditingProduct(prod);
    setForm({
      name: prod.name,
      categoryId: prod.categoryId,
      price: prod.price,
      stock: prod.stock,
    });
  };

  // Eliminar
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    try {
      await axios.delete(`${baseURL}/products/${id}`);
      toast.success("Producto eliminado");
      await fetchAllProducts();
    } catch (error) {
      toast.error("Error al eliminar producto");
    }
  };

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

      {/* Tabla */}
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
          {products.map((p) => {
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

      {/* Form admin */}
      {user?.role === "admin" && (
        <div className="max-w-md bg-white p-4 rounded shadow">
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
                <option value="">Seleccione</option>
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
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
