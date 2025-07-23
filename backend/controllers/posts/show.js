import { promisify } from 'util';
import db from "../../config/db.js";
import countLikes from "../../functions/countLikes.js";

const query = promisify(db.query).bind(db);

const show = async (req, res) => {
    const postId = req.params.id;
    console.log('Otrzymano próbę wyświetlenia posta. ID: ', postId)

    if (isNaN(Number(postId))) {
        return res.status(400).json({ error: 'Nieprawidłowy identyfikator' });
    }

    try {
        const post = await query('SELECT * FROM posts WHERE id = ? LIMIT 1', [postId])
        if (post.length === 0) {
            return res.status(404).json({ error: 'Post nie znaleziony' });
        }

        // Zliczamy ilość polubień dla posta
        const likes = await countLikes(postId)
        post[0].likes = likes

        // Pobieranie nazwy użytkownika z id
        let author = 'Użytkownik usunięty'
        if(post[0].author !== null) {
            const user = await query('SELECT email FROM users WHERE id = ? LIMIT 1', [post[0].author])
            author = user[0].email
        }

        post[0].author = author


        res.json(post[0]);
    }
    catch(err) {

        console.error('Błąd podczas zapytania do bazy:', err);
        return res.status(500).json({ error: 'Błąd serwera' });
    }
}

export default show;