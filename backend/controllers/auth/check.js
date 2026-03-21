import db from '../../config/db.js';
import checkFunc from '../../functions/checkFunc.js';

const check = async (req, res) => {
    const token = req.cookies.token

    const user = checkFunc(token)
    if(user === null) {
        return res.status(401).json({ error: 'common.authErr' })
    }

    try {
        const [result] = await db.query('SELECT username FROM users WHERE id = ? LIMIT 1', [user.id])
        res.json({ success: true, user: result[0].username, perm: user.perm, id: user.id })
    }
    catch(err) {
        return res.status(401).json({ error: 'common.authErr' })
    }
}

export default check;