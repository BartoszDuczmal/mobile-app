import axios from "axios";

export const handleLike = async (id: number) => {
    try {
        const res = await axios.post(`http://192.168.1.151:3001/posts/${id}/likes`, { }, { withCredentials: true });
        return res.data
    } catch(err: any) {
        const message = err.response?.data?.error.sqlMessage || err.message || JSON.stringify(err)
        alert('Nie udało się polubić!\nError: ' + message)
        return false
    }
}