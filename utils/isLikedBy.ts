import { API_URL } from "@/config.js";
import axios from "axios";

export const isLikedBy = async (id: number) => {
    try {
        const res = await axios.post(`${API_URL}:3001/posts/${id}/isLikedBy`, { }, { withCredentials: true });
        return res.data
    } catch(err: any) {
        return false
    }
}