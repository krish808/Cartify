import api from "./api"

export const updateMyProfile =async(updates)=>{
    const res = await api.patch("/api/users/me",updates)
    return res.data
}
