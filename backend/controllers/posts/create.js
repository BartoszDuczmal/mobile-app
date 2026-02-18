import db from '../../config/db.js';
import checkFunc from '../../functions/checkFunc.js';
import schemaPost from "../../models/postModel.js";

const create = async (req, res) => {
    const user = checkFunc(req.cookies.token)
    if(user === null) {
        return res.status(401).json({ error: 'common.mustLogInErr' })
    }

    console.log('Otrzymano post: ', req.body, '-> ID: ', user.id)

    const { error, value } = schemaPost.validate(req.body)
    if(error) {
        console.log('Bledna walidacja! Error: ' + error)
        return res.status(400).json({ error: 'posts.publish.incorrect' });
    }

    try {
        const [result] = await db.query('INSERT INTO posts (title, description, author) VALUES (?, ?, ?)', [value.title, value.desc, user.id])
        res.json({ success: true, id: result.insertId });
    }
    catch(err) {
        console.log('Blad podczas zapytania do bazy! Error: ' + err)
        return res.status(500).json({ error: 'common.internalErr' });
    }
}

export default create;