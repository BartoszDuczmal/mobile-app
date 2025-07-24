import dotenv from 'dotenv';
import { promisify } from 'util';
import db from '../../config/db.js';
import checkFunc from '../../functions/checkFunc.js';

dotenv.config();

const query = promisify(db.query).bind(db);

const check = async (req, res) => {
    const token = req.cookies.token

    const id = checkFunc(token)

    if(id === null) {
        console.log('Błąd autoryzacji!')
        return res.status(401).json({ error: 'Błąd autoryzacji!' })
    }
    try {
        const result = await query('SELECT email FROM users WHERE id = ? LIMIT 1', [id])
        console.log('Zdekodowano: ' + result[0].email)
        res.json({ success: true, user: result[0].email })
    }
    catch(err) {
        console.log('Błąd autoryzacji!')
        return res.status(401).json({ error: 'Błąd autoryzacji!' })
    }
}

export default check;