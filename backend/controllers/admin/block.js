import dotenv from 'dotenv';
import { promisify } from 'util';
import db from '../../config/db.js';
import checkFunc from '../../functions/checkFunc.js';

dotenv.config();

const query = promisify(db.query).bind(db);

const check = async (req, res) => {
    try {
        const token = req.cookies.token
        const id = req.body.id

        if(!token) {
            return res.status(401).json({ error: 'Nie możesz wykonać tej czynności.' })
        }
        const user = checkFunc(token)
        if(user === null || user.perms !== 'admin') {
            return res.status(401).json({ error: 'Nie możesz wykonać tej czynności.' })
        }

        if(user.id.toString() === id.toString()) {
            return res.status(401).json({ error: 'Nie możesz zablokować samego siebie.' })
        }

        // DALSZY CIAG DOPISZE POZNIEJ
    }
    catch(err) {
        return res.status(500).json({ error: 'Wystąpił wewnętrzny błąd serwera.' })
    }
}

export default check;