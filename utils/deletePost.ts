import { API_URL } from "@/config.js";
import axios from "axios";
import { router } from "expo-router";

export const deletePost = async (id: number, openModal: ({type, title, msg}: { type: string, title: string, msg?: string }) => any) => {
    const result = await openModal({ type: 'inquiry', title: 'Czy na pewno chcesz usunąć ten wpis?'})
    if(!result) return
    try {
        const res = await axios.delete(`${API_URL}/posts/${id}/remove`, { withCredentials: true });
        router.replace('/(tabs)/posts')
        openModal({ type: 'info', title: 'Pomyślnie usunięto.', msg: 'Wpis został usunięty.'})
    } catch(err: any) {
        const msg = err.response?.data?.error || 'Wystąpił wewnętrzny błąd serwera.'
        openModal({ type: 'error', title: 'Nie udało się usunąć.', msg: 'Wpis nie został usunięty i dalej jest dostępny.'})
    }
}