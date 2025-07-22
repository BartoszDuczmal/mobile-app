import axios from "axios"

export const checkAuth = async () => {
    try {
        const res = await axios.get('http://192.168.1.151:3001/auth/check', { withCredentials: true })
        return { loggedIn: true, user: res.data.user}
    }
    catch {
        return { loggedIn: false }
    }
}