import api from "./api";

export const registerUser = async (credentials) => {
  const res = await api.post("/api/auth/register", credentials);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/api/auth/login", data);
  return res.data;
};

export const refreshToken = async () => {
  const res = await api.post("/api/auth/refresh");
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.post("/api/auth/logout");
  return res.data;
};
