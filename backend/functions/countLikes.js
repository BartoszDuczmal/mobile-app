import db from "../config/db.js";

// Zrobic do show.js i fetchPosts.js zliczanie polubien
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