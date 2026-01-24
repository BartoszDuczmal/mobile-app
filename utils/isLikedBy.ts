import { API_URL } from "@/providers/config";
import axios from "axios";

export const isLikedBy = async (id: number) => {
    try {
        const res = await axios.post(`${API_URL}/posts/${id}/isLikedBy`, { }, { withCredentials: true });
        return res.data
    } catch(err: any) {
        return false
    }
}