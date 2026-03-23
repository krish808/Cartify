import api from "./api";

export const getAllProducts = async () => {
  const res = await api.get("/api/products/all");
  return res.data;
};

export const getProductById = async (id) => {
  const res = await api.get(`/api/products/${id}`);
  return res.data;
};

// ready for future features

export const getProductsByCategory = async (category) => {
  const res = await api.get(`/api/products/all?category=${category}`);
  return res.data;
};

export const searchProducts = async (query) => {
  const res = await api.get(`api/products/all?search=${query}`);
  return res.data;
};
