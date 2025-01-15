/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react';
import { getToken, setToken, removeToken } from '../services/localstorage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = getToken();
    if (storedToken) {
      // Intenta decodificar o validar
    }
  }, []);

  const handleLogin = (data) => {
    setToken(data.token);
    setUser(data.user);
  };

  const handleLogout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
