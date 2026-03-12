import db from '../../config/db.js';

const fetch = async (req, res) => {
    try {
        const postId = parseInt(req.params.id, 10)
        const [ comments ] = await db.query(`
            SELECT 
                c.id, 
                c.author_id, 
                COALESCE(u.username, 'Deleted User') AS author_name,
                c.content, 
                c.created_at 
            FROM comments c 
            LEFT JOIN users u ON c.author_id = u.id
            WHERE post_id = ? 
            ORDER BY created_at DESC`
            , [postId])
        
        res.json(comments)
    }
    catch(err) {
        return res.status(500).json({ error: 'comments.fetch.notLoad' })
    }
}

export default fetch;