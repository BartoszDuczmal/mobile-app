import db from '../../config/db.js';
import checkFunc from '../../functions/checkFunc.js';


const myShow = async (req, res) => {
    const token = req.cookies.token
    
    const user = checkFunc(token)
    if(user === null) {
        console.log('Nieautoryzano!')
        return res.status(401).json({ error: 'Błąd autoryzacji!' })
    }

    try {
        const [qInfo] = await db.query('SELECT id, username, email, perms, created_at FROM users WHERE id=? LIMIT 1', [user.id])
        if(qInfo.length === 0) {
            return res.status(400).json({ error: msg })
        }
        return res.json(qInfo[0])
    }
    catch(err) {
        return res.status(500).json({ error: 'Wystąpił wewnętrzny błąd serwera.' })
    }
}

export default myShow;