/* eslint-disable no-useless-catch */
import axios from "axios";

const baseURL = "http://localhost:4000";

export const login = async (username, password) => {
  try {
    const { data: users } = await axios.get(
      `${baseURL}/users?username=${username}&password=${password}`
    );

    if (users.length === 0) {
      throw new Error("Credenciales incorrectas");
    }

    const user = users[0];
    if (!user.enabled) {
      throw new Error("Usuario deshabilitado");
    }

    //harcodeado
    const token = "fakeJWTToken123";
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        enabled: user.enabled,
      },
    };
  } catch (error) {
    throw error;
  }
};
