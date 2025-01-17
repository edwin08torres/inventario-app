import axios from "axios";

const baseURL = "https://67890cb02c874e66b7d76623.mockapi.io/Api/V1";

export const getProducts = async () => {
  const { data } = await axios.get(`${baseURL}/Products`);
  return data;
};

export const createProduct = async (prod) => {
  const { data } = await axios.post(`${baseURL}/Products`, prod);
  return data;
};

export const updateProduct = async (id, prod) => {
  const { data } = await axios.put(`${baseURL}/Products/${id}`, prod);
  return data;
};

export const deleteProduct = async (id) => {
  await axios.delete(`${baseURL}/Products/${id}`);
};
