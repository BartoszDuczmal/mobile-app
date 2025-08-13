import { promisify } from 'util';
import db from "../../config/db.js";
import checkFunc from "../../functions/checkFunc.js";

const query = promisify(db.query).bind(db);

const remove = async (req, res) => {
    const postId = req.params.id
    const userId = checkFunc(req.cookies.token)
    try {
    // Sprawdzanie czy użytkownik może usunąć posta
    const qAuthor = await query(`SELECT author FROM posts WHERE id=? LIMIT 1`, [postId])
    if(qAuthor.length === 0) {
        return res.status(404).json({ error: 'Post nie znaleziony!' })
    }
    if(qAuthor[0].author !== userId) {
        return res.status(403).json({ error: 'Nie możesz wykonać tej czynności!' })
    }
    const qDelete = await query('DELETE FROM posts WHERE id=?', [postId])
    if(qDelete.affectedRows === 0) {
        return res.status(500).json({ error: 'Błąd!' })
    }
    return res.json({ success: true })
    }
    catch(err) {
        console.error(err);
        return res.status(500).json({ error: "Błąd!" });
    }
}

export default remove;