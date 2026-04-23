import db from '../../config/db.js';
import checkFunc from '../../functions/checkFunc.js';

const fetch = async (req, res) => {
    try {
        const keyUser = await checkFunc(req.cookies.token)

        let posts;

        const user = req.body?.name

        if(user) {
            [ posts ] = await db.query(`
                SELECT 
                    p.id, 
                    p.title, 
                    p.description, 
                    (SELECT COUNT(*) FROM posts_likes WHERE post_id = p.id) AS likes,
                    EXISTS(SELECT 1 FROM posts_likes WHERE post_id = p.id AND user_id = ?) AS isLiked
                FROM posts p 
                JOIN users u 
                ON p.author = u.id 
                WHERE u.username = ? 
                ORDER BY p.created_at DESC`
            , [keyUser?.id || null, user])
        }
        else {
            [ posts ] = await db.query(`
                SELECT 
                    p.id, 
                    p.title, 
                    p.description,
                    (SELECT COUNT(*) FROM posts_likes WHERE post_id = p.id) AS likes,
                    EXISTS(SELECT 1 FROM posts_likes WHERE post_id = p.id AND user_id = ?) AS isLiked
                FROM posts p
                ORDER BY p.created_at DESC`
            , [keyUser?.id || null]);
        }

        res.json(posts)
    }
    catch(err) {
        return res.status(500).json({ error: 'posts.fetch.notLoad' })
    }
}

export default fetch;