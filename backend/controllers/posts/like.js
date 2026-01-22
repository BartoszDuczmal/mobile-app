import db from '../../config/db.js';
import checkFunc from "../../functions/checkFunc.js";
import countLikes from "../../functions/countLikes.js";

const like = async (req, res) => {

    const postId = parseInt(req.params.id, 10)
    if(isNaN(postId)) {
        return res.status(400).json({ error: 'Błąd!' });
    }

    const user = checkFunc(req.cookies.token)
    if(user === null) {
        return res.status(401).json({ error: 'Musisz być zalogowany, aby polubić wpis.' })
    }

    // Próba usunięcia polubienia - jeśli się nie usunie żadne to dodajemy polubienie
    try {
        const [qDelete] = await db.query(`DELETE FROM likes WHERE user_id = ? AND post_id = ?`, [user.id, postId])
        if(qDelete.affectedRows > 0) {
            console.log('Pomyślnie usunięto polubienie postu o postId: ' + postId)
            const likes = await countLikes(postId)
            return res.json({ success: true, likes: likes })
        }
        else {
            // Dodawanie polubienia
            const [qInsert] = await db.query(`INSERT INTO likes (post_id, user_id) VALUES (?, ?)`, [postId, user.id])
            console.log('Pomyślnie polubiono post o postId: ' + postId)
            const likes = await countLikes(postId)
            return res.json({ success: true, likes: likes })
        }
    }
    catch(err) {
        return res.status(500).json({ error: err })
    }
}
export default like;