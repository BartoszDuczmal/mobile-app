import db from '../../config/db.js';
import checkFunc from "../../functions/checkFunc.js";

const like = async (req, res) => {

    const postId = parseInt(req.params.id, 10)
    if(isNaN(postId)) {
        return res.status(400).json({ error: 'common.internalErr' });
    }

    const user = checkFunc(req.cookies.token)
    if(user === null) {
        return res.status(401).json({ error: 'common.unauthorized' })
    }

    // Próba usunięcia polubienia - jeśli się nie usunie żadne to dodajemy polubienie
    try {
        const [qDelete] = await db.query(`DELETE FROM posts_likes WHERE user_id = ? AND post_id = ?`, [user.id, postId])
        if(qDelete.affectedRows > 0) {
            return res.json({ success: true, type: 'remove' })
        }
        else {
            // Dodawanie polubienia
            const [qInsert] = await db.query(`INSERT INTO posts_likes (post_id, user_id) VALUES (?, ?)`, [postId, user.id])
            return res.json({ success: true, type: 'add' })
        }
    }
    catch(err) {
        return res.status(500).json({ error: 'common.internalErr' })
    }
}
export default like;