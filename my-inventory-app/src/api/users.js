import axios from "axios";

const baseURL = "https://67890cb02c874e66b7d76623.mockapi.io/Api/V1";

export const getUsers = async () => {
  const { data } = await axios.get(`${baseURL}/users`);
  return data;
};

export const searchUsersByUsername = async (term) => {
  const { data } = await axios.get(`${baseURL}/users?username_like=${term}`);
  return data;
};

export const createUser = async (newUser) => {
  const { data } = await axios.post(`${baseURL}/users`, newUser);
  return data;
};

export const updateUser = async (id, updatedUser) => {
  const { data } = await axios.put(`${baseURL}/users/${id}`, updatedUser);
  return data;
};

export const patchUser = async (id, partialUser) => {
  const { data } = await axios.patch(`${baseURL}/users/${id}`, partialUser);
  return data;
};

export const deleteUser = async (id) => {
  await axios.delete(`${baseURL}/users/${id}`);
};
