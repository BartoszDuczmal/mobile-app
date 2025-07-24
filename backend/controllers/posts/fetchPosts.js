import { promisify } from 'util';
import db from '../../config/db.js';
import countLikes from '../../functions/countLikes.js';

const query = promisify(db.query).bind(db);

const fetchPosts = async (req, res) => {
    try {
        const result = await query('SELECT id, title, description FROM posts ORDER BY created_at DESC')
        const posts = await Promise.all(
            result.map(async (post) => {
                const likes = await countLikes(post.id)
                return {...post, likes}
            })
        )
        res.json(posts)
    }
    catch(err) {
        return res.status(500).json({ error: err });
    }
}

export default fetchPosts;