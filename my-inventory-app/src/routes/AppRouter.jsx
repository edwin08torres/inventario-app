/* eslint-disable react/prop-types */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import LoginPage from "../components/pages/Login";
import HomePage from "../components/pages/Home";
// ... etc

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta de login (pública) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Ruta protegida de ejemplo */}
        <Route 
          path="/" 
          element={<PrivateRoute><HomePage /></PrivateRoute>} 
        />

        {/* Redireccionar si no coincide */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};
