import db from '../../config/db.js';
import checkFunc from "../../functions/checkFunc.js";

const isLikedBy = async (req, res) => {
    const postId = parseInt(req.params.id, 10)
    if(isNaN(postId)) {
        return res.status(400).json({ error: 'Błąd!' });
    }

    const user = checkFunc(req.cookies.token)
    if(user === null) {
        return res.json(false)
    }
    try {
        const [result] = await db.query('SELECT id FROM likes WHERE user_id = ? AND post_id = ? LIMIT 1', [user.id, postId])
        
        return res.json(result.length > 0)
    }
    catch(err) {
        return res.json(false)
    }
}

export default isLikedBy;