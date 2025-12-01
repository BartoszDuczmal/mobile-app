import { API_URL } from "@/config.js";
import axios from "axios";

export const handleLike = async (id: number, openModal: ({type, title, msg}: { type: string, title: string, msg: string }) => void) => {
    try {
        const res = await axios.post(`${API_URL}:3001/posts/${id}/likes`, { }, { withCredentials: true });
        return res.data
    } catch(err: any) {
        const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'Wystąpił nieznany błąd serwera.'
        openModal({ type: "error", title: 'Nie można polubić wpisu.', msg: errMsg })
    }
}