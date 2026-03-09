import api from "./api";

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const refreshToken = async () => {
  const res = await api.post("/auth/refresh");
  return res.data;
};

export const logoutUser = async () => {
  await api.post("/auth/logout");
};
