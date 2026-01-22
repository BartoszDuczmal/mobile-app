import dotenv from 'dotenv';
import db from '../../config/db.js';
import checkFunc from '../../functions/checkFunc.js';

dotenv.config();

const check = async (req, res) => {
    try {
        const token = req.cookies.token
        const id = req.body.id
        
        if(!token) {
            console.log('Wywalam sie na tokenie')
            return res.status(401).json({ error: 'Nie możesz wykonać tej czynności.' })
        }
        const user = checkFunc(token)
        if(user === null || user.perm !== 'admin') {
            return res.status(403).json({ error: 'Nie możesz wykonać tej czynności.' })
        }
        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Nieprawidłowe ID.' });
        }

        if(user.id.toString() === id.toString()) {
            return res.status(403).json({ error: 'Nie możesz odblokować samego siebie.' })
        }

        const [result] = await db.query(`UPDATE users SET perms=? WHERE id=? LIMIT 1`, [null, id])
        if(result.affectedRows === 0) {
            return res.status(404).json({ error: 'Nie znaleziono użytkownika.'})
        }
        if (result.changedRows === 0) {
            return res.status(400).json({ error: 'Użytkownik nie jest zablokowany.' });
        }
        res.json({ success: true })
    }
    catch(err) {
        console.error('Błąd podczas blokowania użytkonika:\n', err)
        return res.status(500).json({ error: 'Wystąpił wewnętrzny błąd serwera.' })
    }
}

export default check;