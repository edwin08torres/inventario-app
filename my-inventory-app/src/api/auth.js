/* eslint-disable no-useless-catch */
import axios from "axios";

export const login = async (username, password) => {

  //harcodeado
  const mockToken = "abc123";
  try {
    const { data: users } = await axios.get("http://localhost:4000/users");
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      throw new Error("Credenciales incorrectas");
    }
    if (!user.enabled) {
      throw new Error("Usuario deshabilitado");
    }
    // Retornamos token mock y rol del usuario
    return {
      token: mockToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        enabled: user.enabled,
      },
    };
  } catch (err) {
    throw err;
  }
};
