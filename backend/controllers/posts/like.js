import db from "../../config/db.js";

const like = (req, res) => {
    if(req.params.id != req.body.id) {
        console.log('Numery id nie sa takie same!' + err)
        return res.status(400).json({ error: err });
    }
    console.log('Zalajkowano post o id: ' + req.body.id)

    const sql = 'UPDATE posts SET likes = likes + 1 WHERE id = ?'
    db.query(sql, [req.body.id], (err, result) => {
        if (err) {
        console.log('Blad podczas zapytania do bazy! Error: ' + err)
        return res.status(500).json({ error: err });
        }
        res.json(result);
    })
}

export default like;