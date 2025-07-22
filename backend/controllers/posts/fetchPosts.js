import db from '../../config/db.js';
import countLikes from '../../functions/countLikes.js';

const fetchPosts = (req, res) => {
    const sql = 'SELECT id, title, description FROM posts ORDER BY created_at DESC'
    db.query(sql, async (err, result) => {
        if (err) return res.status(500).send(err);
        // Pobieramy ilość polubień i wstawiamy do każdego posta
        const posts = await Promise.all(
            result.map(async (post) => {
                try {
                    const likes = await countLikes(post.id)
                    return {...post, likes}
                } catch (err) {
                    console.log('Błąd: ' + err)
                    return {...post, likes: -1}
                }
            })
        )
        res.json(posts)
    });
}

export default fetchPosts;