import { api } from "@/services/api";

export const checkAuth = async () => {
    try {
        const res = await api.get(`/auth/check`)
        return { loggedIn: true, user: res.data.user, perm: res.data.perm, id: res.data.id}
    }
    catch {
        return { loggedIn: false }
    }
}