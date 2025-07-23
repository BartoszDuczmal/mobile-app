import db from "../config/db.js";

const countLikes = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id FROM likes WHERE post_id = ?'
        db.query(sql, [id], (err, result) => {
            if(err) {
                return reject(err)
            }
            resolve(result.length)
        })
    })
}

export default countLikes;