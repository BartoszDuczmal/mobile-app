import db from '../../config/db.js';
import countLikes from "../../functions/countLikes.js";

const show = async (req, res) => {
    const postId = req.params.id;
    console.log('Otrzymano próbę wyświetlenia posta. ID: ', postId)

    if (isNaN(Number(postId))) {
        return res.status(400).json({ error: 'common.wrongIdErr' });
    }

    try {
        const [post] = await db.query('SELECT * FROM posts WHERE id = ? LIMIT 1', [postId])
        if (post.length === 0) {
            return res.status(404).json({ error: 'posts.show.notFound' });
        }

        // Zliczamy ilość polubień dla posta
        const likes = await countLikes(postId)
        post[0].likes = likes

        // Pobieranie nazwy użytkownika z id
        let author = 'Użytkownik usunięty'
        if(post[0].author !== null) {
            const [user] = await db.query('SELECT username FROM users WHERE id = ? LIMIT 1', [post[0].author])
            author = user[0].username
        }

        post[0].author = author


        res.json(post[0]);
    }
    catch(err) {

        console.error('Błąd podczas zapytania do bazy:', err);
        return res.status(500).json({ error: 'common.internalErr' });
    }
}

export default show;