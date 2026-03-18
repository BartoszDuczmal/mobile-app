import dotenv from 'dotenv';
import db from '../../config/db.js';
import checkFunc from '../../functions/checkFunc.js';
import schemaPost from '../../models/postModel.js';

dotenv.config();

const add = async (req, res) => {
    try {
        const token = req.cookies.token

        const user = checkFunc(token)
        if(user === null) {
            return res.status(401).json({ error: 'common.unauthorized' })
        }

        // Sprawdzenie formatu
        const { error, value } = schemaPost.extract('desc').validate(req.body.content)
        if(error) {
            return res.status(400).json({ error: 'comments.add.wrongFormat' })
        }
        const postId = Number(req.body.post)

        // Dodanie komentarza
        const [ qAdd ] = await db.query('INSERT INTO comments (author_id, post_id, content) VALUES (?, ?, ?)', [user.id, postId, value])
        res.json({ success: true, id: qAdd.insertId })
    } 
    catch(err) {
        return res.status(500).json({ error: 'common.internalErr' })
    }
}

export default add;