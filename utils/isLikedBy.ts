import axios from "axios";

export const isLikedBy = async (id: number) => {
    try {
        const res = await axios.post(`http://192.168.1.151:3001/posts/${id}/isLikedBy`, { }, { withCredentials: true });
        return res.data
    } catch(err: any) {
        return false
    }
}