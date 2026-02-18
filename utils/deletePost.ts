import '@/locales/config';
import i18n from '@/locales/config';
import { API_URL } from "@/providers/config";
import axios from "axios";
import { router } from "expo-router";

export const deletePost = async (id: number, openModal: ({type, title, msg}: { type: string, title: string, msg?: string }) => any, t: any) => {
    const result = await openModal({ type: 'inquiry', title: i18n.t('posts.delete.inquiry') })
    if(!result) return
    try {
        const res = await axios.delete(`${API_URL}/posts/${id}/remove`, { withCredentials: true });
        router.replace('/(tabs)/posts')
        openModal({ type: 'info', title: i18n.t('posts.delete.scs.title'), msg: i18n.t('posts.delete.scs.msg')})
    } catch(err: any) {
        const msg = err.response?.data?.error || t('common.internalErr')
        openModal({ type: 'error', title: i18n.t('posts.delete.err.title'), msg: i18n.t('posts.delete.err.msg')})
    }
}