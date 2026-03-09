import api from "./api";

export const getAllProducts = async () => {
  const res = await api.get("/products/all");
  return res.data;
};

export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};
