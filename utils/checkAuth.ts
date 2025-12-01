import { API_URL } from "@/config.js"
import axios from "axios"

export const checkAuth = async () => {
    try {
        const res = await axios.get(`${API_URL}:3001/auth/check`, { withCredentials: true })
        return { loggedIn: true, user: res.data.user, perm: res.data.perm}
    }
    catch {
        return { loggedIn: false }
    }
}