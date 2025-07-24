import { promisify } from 'util';
import db from "../config/db.js";

const query = promisify(db.query).bind(db);

const countLikes = async (id) => {
    try {
        const result = await query('SELECT COUNT(*) AS count FROM likes WHERE post_id = ?', [id])
        return result[0].count
    }
    catch(err) {
        return -1
    }
}

export default countLikes;