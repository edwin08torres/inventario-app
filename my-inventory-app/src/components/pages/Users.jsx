/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const UsersPage = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  // Solo admins pueden ver otros usuarios
  useEffect(() => {
    if (user?.role === "admin") {
      axios
        .get("http://localhost:4000/users")
        .then((res) => setUsers(res.data))
        .catch((err) => toast.error("Error al cargar usuarios"));
    }
  }, [user]);

  const handleEnableDisable = async (userId, enabled) => {
    try {
      await axios.patch(`http://localhost:4000/users/${userId}`, { enabled });
      toast.success(
        `Usuario ${enabled ? "habilitado" : "deshabilitado"} con éxito`
      );
      // Refrescar lista
    } catch (error) {
      toast.error("Error al actualizar el usuario");
    }
  };

  if (user?.role !== "admin") {
    return <div>No tienes permisos para ver esta sección</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-bold">Gestión de Usuarios</h1>
      {/* Tabla o lista de usuarios */}
      {users.map((u) => (
        <div key={u.id}>
          <span>{u.username}</span>
          <button onClick={() => handleEnableDisable(u.id, !u.enabled)}>
            {u.enabled ? "Deshabilitar" : "Habilitar"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default UsersPage;
