import db from '../../config/db.js';
import checkFunc from '../../functions/checkFunc.js';

const show = async (req, res) => {
    const postId = req.params.id;
    console.log('Otrzymano próbę wyświetlenia posta. ID: ', postId)

    if (isNaN(Number(postId))) {
        return res.status(400).json({ error: 'common.wrongIdErr' });
    }

    try {
        const keyUser = await checkFunc(req.cookies.token)

        const [post] = await db.query(`
            SELECT 
                p.id,
                p.title,
                p.description,
                p.created_at,
                COALESCE(u.username, 'Deleted User') AS author,
                (SELECT COUNT(*) FROM posts_likes WHERE post_id = p.id) AS likes,
                EXISTS(SELECT 1 FROM posts_likes WHERE post_id = p.id AND user_id = ?) AS isLiked
            FROM posts p
            LEFT JOIN users u
            ON p.author = u.id
            WHERE p.id = ?`
        , [keyUser?.id || null, postId])

        if (post.length === 0) {
            return res.status(404).json({ error: 'posts.show.notFound' });
        }

        res.json(post[0]);
    }
    catch(err) {
        return res.status(500).json({ error: 'common.internalErr' });
    }
}

export default show;