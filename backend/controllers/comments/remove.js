import db from '../../config/db.js';
import checkFunc from '../../functions/checkFunc.js';

const remove = async (req, res) => {
    try {
        const token = req.cookies.token
        const keyUser = checkFunc(token)
        const id = req.body.id

        if (!keyUser) {
            return res.status(401).json({ error: 'common.unauthorized' });
        }

        if(keyUser.perm !== 'admin') {
            const [ qOwner ] = await db.query('SELECT id FROM comments WHERE id=? AND author_id=? LIMIT 1', [id, keyUser.id])
            if(qOwner.length === 0) {
                return res.status(403).json({ error: 'common.noAccess' }) 
            }
        }
        const [ qDelete ] = await db.query('DELETE FROM comments WHERE id=?', [id])
        return res.json({ success: true })
    }
    catch(err) {
        console.error(err)
        return res.status(500).json({ error: 'common.internalErr' })
    }
}

export default remove;