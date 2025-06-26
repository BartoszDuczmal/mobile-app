import db from "../../config/db.js";

const show = (req, res) => {
    const postId = req.params.id;

    if (isNaN(Number(postId))) {
    return res.status(400).json({ error: 'Nieprawidłowy identyfikator' });
    }

    const sql = 'SELECT * FROM posts WHERE id = ?';
    db.query(sql, [postId], (err, result) => {
        if (err) {
        console.error('Błąd podczas zapytania do bazy:', err);
        return res.status(500).json({ error: 'Błąd serwera' });
        }

        if (result.length === 0) {
        return res.status(404).json({ error: 'Post nie znaleziony' });
        }

        res.json(result[0]);
    });
}

export default show;