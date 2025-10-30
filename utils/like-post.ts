import axios from "axios";

export const handleLike = async (id: number, openModal: ({title, msg}: { title: string, msg: string }) => void) => {
    try {
        const res = await axios.post(`http://192.168.1.151:3001/posts/${id}/likes`, { }, { withCredentials: true });
        return res.data
    } catch(err: any) {
        const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'Wystąpił nieznany błąd serwera.'
        openModal({ title: 'Nie można polubić wpisu.', msg: errMsg })
    }
}