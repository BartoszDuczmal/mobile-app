import i18n from '@/locales/config';
import { API_URL } from "@/providers/config";
import axios from "axios";

export const handleLike = async (id: number, openModal: ({type, title, msg}: { type: string, title: string, msg: string }) => void) => {
    try {
        const res = await axios.post(`${API_URL}/posts/${id}/likes`, { }, { withCredentials: true });
        return res.data
    } catch(err: any) {
        const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'common.internalErr'
        openModal({ type: "error", title: i18n.t('common.likeErr'), msg: errMsg })
    }
}