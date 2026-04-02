import api from "./api";

export const getCart = async () => {
  const res = await api.get("/api/cart");
  return res.data;
};

export const addCartItem = async (productId, quantity = 1) => {
  const res = await api.post("/api/cart", { productId, quantity });
  return res.data;
};

// ✅ PATCH /api/cart/:productId
export const updateCartItemQuantity = async (productId, quantity) => {
  const res = await api.patch(`/api/cart/${productId}`, { quantity });
  return res.data;
};

// ✅ Fixed — removed /item/ prefix to match backend
export const removeCartItem = async (productId) => {
  const res = await api.delete(`/api/cart/${productId}`);
  return res.data;
};

export const clearCartItems = async () => {
  const res = await api.delete("/api/cart");
  return res.data;
};

export const mergeCartItems = async (items) => {
  const res = await api.post("/api/cart/merge", { items });
  return res.data;
};
