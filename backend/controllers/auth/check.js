import dotenv from 'dotenv';
import db from '../../config/db.js';
import checkFunc from '../../functions/checkFunc.js';

dotenv.config();

const check = async (req, res) => {
    const token = req.cookies.token

    const user = checkFunc(token)
    if(user === null) {
        console.log('Nieautoryzano!')
        return res.status(401).json({ error: 'Błąd autoryzacji!' })
    }

    try {
        const [result] = await db.query('SELECT username FROM users WHERE id = ? LIMIT 1', [user.id])
        console.log('Zdekodowano: ' + result[0].username)
        res.json({ success: true, user: result[0].username, perm: user.perm })
    }
    catch(err) {
        console.log('Błąd autoryzacji!')
        return res.status(401).json({ error: 'Błąd autoryzacji!' })
    }
}

export default check;