import db from "../../config/db.js"
import schemaPost from "../../models/postModel.js"

const create = (req, res) => {
    console.log('Otrzymano post: ', req.body)

    const { error, value } = schemaPost.validate(req.body)
    if(error) {
        console.log('Bledna walidacja! Error: ' + error)
        return res.status(400).json({ error: error.details[0].message });
    }

    const sql = 'INSERT INTO posts (title, description, likes) VALUES (?, ?, 0)' 
    db.query(sql, [value.title, value.desc], (err, result) => {
        if (err) {
          console.log('Blad podczas zapytania do bazy! Error: ' + err)
          return res.status(500).json({ error: err });
        }
        res.json({ success: true, id: result.insertId });
    })
}

export default create;