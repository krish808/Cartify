import api from "./api";

export const loginUser = async (data) => {
  const res = await api.post("/api/auth/login", data);
  return res.data;
};

export const refreshToken = async () => {
  const res = await api.post("/api/auth/refresh");
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.post("/api/auth/logout", {}, { withCredentials: true });
  return res.data;
};
