import dotenv from 'dotenv';
import db from '../../config/db';
import checkFunc from '../../functions/checkFunc';
import schemaPost from '../../models/postModel';

dotenv.config();

const add = async (req, res) => {
    const token = req.cookies.token
    
    const user = checkFunc(token)
    if(user === null) {
        return res.status(401).json({ error: 'Musisz najpierw się zalogować.' })
    }

    const { error, value } = schemaPost.extract('desc').validate(req.body.content)
    if(error) {
        return res.status(400).json({ error: 'Nieprawidłowy format komentarza.' })
    }

    try {
        const postId = Number(req.body.post)

        const [ qAdd ] = await db.query('INSERT INTO comments (author_id, post_id, content) VALUES (?, ?, ?)', [user.id, postId, value])
        res.json({ success: true, id: qAdd.insertId })
    } 
    catch(err) {
        return res.status(500).json({ error: 'Wystąpił wewnętrzny błąd serwera.' })
    }
}

export default add;