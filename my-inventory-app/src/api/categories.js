import axios from "axios";

const baseURL = "https://67890cb02c874e66b7d76623.mockapi.io/Api/V1/categories";

export const getAllCategories = async () => {
  const { data } = await axios.get(baseURL);
  return data;
};

export const createCategory = async (category) => {
  const { data } = await axios.post(baseURL, category);
  return data;
};

export const updateCategory = async (id, category) => {
  const { data } = await axios.put(`${baseURL}/${id}`, category);
  return data;
};

export const deleteCategory = async (id) => {
  await axios.delete(`${baseURL}/${id}`);
};
