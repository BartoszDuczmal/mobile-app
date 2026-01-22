import db from '../../config/db.js';

const countLikes = async (id) => {
    try {
        const [result] = await db.query('SELECT COUNT(*) AS count FROM likes WHERE post_id = ?', [id])
        return result[0].count
    }
    catch(err) {
        return -1
    }
}

export default countLikes;