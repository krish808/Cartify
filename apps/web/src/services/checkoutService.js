import api from "./api"

export const placeOrder = async(couponCode)=>{
    const payload = couponCode ? {couponCode} :{}

    const res = await api.post("/api/checkout",payload)
    return res.data
}