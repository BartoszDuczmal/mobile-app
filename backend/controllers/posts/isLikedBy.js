import db from "../../config/db.js";
import checkFunc from "../../functions/checkFunc.js";

const isLikedBy = (req, res) => {
    const id = parseInt(req.params.id, 10)
    if(isNaN(id)) {
        return res.status(401).json({ error: 'Błąd!' });
    }

    const email = checkFunc(req.cookies.token)
    if(email === null) {
        return res.json(false)
    }

    const sql = 'SELECT likes.id FROM likes INNER JOIN users ON likes.user_id = users.id WHERE users.email = ? AND likes.post_id = ? LIMIT 1'
    db.query(sql, [email, id], (err, result) => {
        if(err) {
            return res.json(false)
        }
        if(result.length === 0) {
            return res.json(false)
        }
        res.json(true)
    })
}

export default isLikedBy;