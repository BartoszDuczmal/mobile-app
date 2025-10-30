import { promisify } from 'util';
import db from "../../config/db.js";
import checkFunc from '../../functions/checkFunc.js';
import schemaPost from "../../models/postModel.js";

const query = promisify(db.query).bind(db);

const create = async (req, res) => {
    const user = checkFunc(req.cookies.token)
    if(user === null) {
        return res.status(401).json({ error: 'Musisz najpierw się zalogować.' })
    }

    console.log('Otrzymano post: ', req.body, '-> ID: ', user.id)

    const { error, value } = schemaPost.validate(req.body)
    if(error) {
        console.log('Bledna walidacja! Error: ' + error)
        return res.status(400).json({ error: 'Błędny format wpisu.' });
    }

    try {
        const result = await query('INSERT INTO posts (title, description, author) VALUES (?, ?, ?)', [value.title, value.desc, user.id])
        res.json({ success: true, id: result.insertId });
    }
    catch(err) {
        console.log('Blad podczas zapytania do bazy! Error: ' + err)
        return res.status(500).json({ error: 'Wystąpił wewnętrzny błąd serwera.' });
    }
}

export default create;