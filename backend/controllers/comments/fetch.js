import db from '../../config/db.js';
import checkFunc from '../../functions/checkFunc.js';

const fetch = async (req, res) => {
    try {
        const postId = parseInt(req.params.id, 10)

        const keyUser = checkFunc(req.cookies.token)

        // Pobranie komentarzy
        const [ comments ] = await db.query(`
            SELECT 
                c.id, 
                c.author_id, 
                COALESCE(u.username, 'Deleted User') AS author_name,
                c.content, 
                c.created_at,
                (SELECT COUNT(*) FROM comments_likes WHERE comment_id = c.id) AS likes,
                EXISTS(SELECT 1 FROM comments_likes WHERE comment_id = c.id AND user_id = ?) AS isLiked
            FROM comments c 
            LEFT JOIN users u ON c.author_id = u.id 
            WHERE c.post_id = ? 
            ORDER BY c.created_at DESC`, 
        [keyUser?.id || null, postId]);
        
        res.json(comments)
    }
    catch(err) {
        console.error(err)
        return res.status(500).json({ error: 'comments.fetch.notLoad' })
    }
}

export default fetch;