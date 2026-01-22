import db from '../../config/db.js';
import countLikes from '../../functions/countLikes.js';

const fetchPosts = async (req, res) => {
    try {
        let result;
        if(req.body?.name) {
            [result] = await db.query('SELECT p.id, p.title, p.description FROM posts p JOIN users u ON p.author = u.id WHERE u.username = ? ORDER BY p.created_at DESC', [req.body.name])
        }
        else {
            [result] = await db.query('SELECT id, title, description FROM posts ORDER BY created_at DESC')
        }
        const posts = await Promise.all(
            result.map(async (post) => {
                const likes = await countLikes(post.id)
                return {...post, likes}
            })
        )
        res.json(posts)
    }
    catch(err) {
        return res.status(500).json({ error: err })
    }
}

export default fetchPosts;