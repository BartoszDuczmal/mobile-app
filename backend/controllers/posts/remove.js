import db from '../../config/db.js';
import checkFunc from "../../functions/checkFunc.js";

const remove = async (req, res) => {

    // Pobieranie ID postu z url
    const postId = parseInt(req.params.id, 10)
    if(isNaN(postId)) {
        return res.status(400).json({ error: 'common.err' });
    }

    // Pobieranie ID użytkownika
    const user = checkFunc(req.cookies.token)
    if(user === null) {
        return res.status(401).json({ error: 'common.mustLogInErr' })
    }

    // Sprawdzanie czy użytkownik może usunąć posta
    if(user.perm !== 'admin') {
        const [qAuthor] = await db.query(`SELECT id FROM posts WHERE id = ? AND author = ? LIMIT 1`, [postId, user.id])
        if(qAuthor.length === 0) {
            return res.status(403).json({ error: 'common.actionErr' })
        }
    }

    // Usunięcie postu
    try {
        const [qDelete] = await db.query('DELETE FROM posts WHERE id=?', [postId])
        if(qDelete.affectedRows === 0) {
            return res.status(500).json({ error: 'common.err' })
        }
        return res.json({ success: true })
    }
    catch(err) {
        console.error(err);
        return res.status(500).json({ error: "common.err" });
    }
}

export default remove;