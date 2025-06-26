import db from '../../config/db.js';

const fetchPosts = (req, res) => {
    db.query('SELECT id, title, description, likes FROM posts ORDER BY created_at DESC', (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
}

export default fetchPosts;