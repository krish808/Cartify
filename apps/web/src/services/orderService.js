import api from "./api";

export const getMyOrders =async()=>{
     const res = await api.get("/api/orders/me");
     return res.data;
}