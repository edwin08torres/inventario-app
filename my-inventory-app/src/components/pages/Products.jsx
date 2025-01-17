/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../api/products";
import { getAllCategories } from "../../api/categories";

const ProductsPage = () => {
  const { user } = useContext(AuthContext);

  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    price: 0,
    stock: 0,
  });
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setAllProducts(data);
      setProducts(data);
    } catch (error) {
      toast.error("Error al cargar productos");
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
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
      toast.success("Producto(s) encontrado(s)");
      setProducts(filtered);
      setCurrentPage(1);
    }
  };

  const handleSearchChange = (e) => setSearch(e.target.value);

  const handleSearchClick = () => filterProducts(search);

  const handleClearFilter = () => {
    setSearch("");
    setProducts(allProducts);
    setCurrentPage(1);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      categoryId: product.categoryId,
      price: product.price,
      stock: product.stock,
    });
    setShowModal(true);
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setForm({ name: "", categoryId: "", price: 0, stock: 0 });
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!form.name.trim()) {
      toast.error("El nombre del producto no puede estar vacío");
      return;
    }
    if (!form.categoryId) {
      toast.error("Debes seleccionar una categoría");
      return;
    }
    if (form.price <= 0) {
      toast.error("El precio debe ser mayor que 0");
      return;
    }
    if (form.stock < 0) {
      toast.error("El stock no puede ser negativo");
      return;
    }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, form);
        toast.success("Producto actualizado");
      } else {
        await createProduct(form);
        toast.success("Producto creado");
      }
      fetchProducts();
      handleCancel();
    } catch (error) {
      toast.error("Error al guardar el producto");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    try {
      await deleteProduct(id);
      toast.success("Producto eliminado");
      fetchProducts();
    } catch (error) {
      toast.error("Error al eliminar el producto");
    }
  };

  // Paginación lógica
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const displayedProducts = products.slice(
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Gestión de Productos</h2>

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

        {/* Botón para abrir el modal */}
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Crear Producto
        </button>
      </div>

      {/* Tabla de productos */}
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
          {displayedProducts.map((p) => {
            const categoryName =
              categories.find((c) => c.id === p.categoryId)?.name ||
              "Sin Categoría";
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
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                  onChange={(e) =>
                    setForm({ ...form, categoryId: e.target.value })
                  }
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
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
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
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="border w-full px-3 py-2 rounded"
                  required
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

export default ProductsPage;
