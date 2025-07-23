import { promisify } from 'util';
import db from "../../config/db.js";
import checkFunc from '../../functions/checkFunc.js';
import schemaPost from "../../models/postModel.js";

const query = promisify(db.query).bind(db);

const create = async (req, res) => {
    const email = checkFunc(req.cookies.token)
    if(email === null) {
        return res.status(401).json({ error: 'Musisz się najpierw zalogować!' })
    }

    const user = await query('SELECT id FROM users WHERE email = ? LIMIT 1', [email])

    console.log('Otrzymano post: ', req.body, email, '->', user[0].id)

    const { error, value } = schemaPost.validate(req.body)
    if(error) {
        console.log('Bledna walidacja! Error: ' + error)
        return res.status(400).json({ error: error.details[0].message });
    }

    const sql = 'INSERT INTO posts (title, description, author) VALUES (?, ?, ?)'
    db.query(sql, [value.title, value.desc, user[0].id], (err, result) => {
        if (err) {
          console.log('Blad podczas zapytania do bazy! Error: ' + err)
          return res.status(500).json({ error: err });
        }
        res.json({ success: true, id: result.insertId });
    })
}

export default create;