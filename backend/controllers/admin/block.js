import dotenv from 'dotenv';
import db from '../../config/db.js';
import checkFunc from '../../functions/checkFunc.js';

dotenv.config();

const check = async (req, res) => {
    try {
        const token = req.cookies.token
        const id = req.body.id
        
        if(!token) {
            return res.status(401).json({ error: 'common.actionErr' })
        }
        const user = checkFunc(token)
        if(user === null || user.perm !== 'admin') {
            return res.status(403).json({ error: 'common.actionErr' })
        }
        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'profile.block.wrongId' });
        }

        if(user.id.toString() === id.toString()) {
            return res.status(401).json({ error: 'profile.block.self' })
        }

        const [result] = await db.query(`UPDATE users SET perms=? WHERE id=? LIMIT 1`, ['blocked', id])
        if(result.affectedRows === 0) {
            return res.status(404).json({ error: 'profile.block.noUser' })
        }
        if (result.changedRows === 0) {
            return res.status(400).json({ error: 'profile.block.already' });
        }
        res.json({ success: true })
    }
    catch(err) {
        console.error('Błąd podczas blokowania użytkonika:\n', err)
        return res.status(500).json({ error: 'common.internalErr' })
    }
}

export default check;