import axios from "axios";

export const handleLike = async (id: number) => {
    try {
        const res = await axios.post(`http://192.168.1.151:3001/posts/${id}/likes`, { id: id });
        return true
    } catch (err) {
        alert('Nie udało się polubić!\nError: ' + err)
        return false
    }
}