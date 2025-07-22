import db from "../../config/db.js";
import checkFunc from "../../functions/checkFunc.js";
import countLikes from "../../functions/countLikes.js";

const like = (req, res) => {
    const id = parseInt(req.params.id, 10)
    if(isNaN(id)) {
        return res.status(401).json({ error: 'Błąd!' });
    }
    const email = checkFunc(req.cookies.token)
    if(email === null) {
        return res.status(401).json({ error: 'Musisz się najpierw zalogować!' })
    }

    // Wyciągamy id użytkownika po emailu

    const sql = `SELECT id FROM users WHERE email = ?`
    db.query(sql, [email], (err, result) => {
        if(err) {
            return res.status(500).json({ error: err })
        }
        if(result.length > 0) {
            const user_id = result[0].id

            // Próba usunięcia polubienia - jeśli się nie usunie żadne to dodajemy polubienie
            const sql = `DELETE FROM likes WHERE user_id = ? AND post_id = ?`
            db.query(sql, [user_id, id], async (err, result) => {
                if(err) {
                    return res.status(500).json({ error: err })
                }
                if(result.affectedRows > 0) {
                    console.log('Pomyślnie usunięto polubienie postu o ID: ' + id)
                    const likes = await countLikes(id)
                    return res.json({ success: true, likes: likes })
                }
                else {
                    // Dodawanie polubienia
                    const sql = `INSERT INTO likes (post_id, user_id) VALUES (?, ?)`
                    db.query(sql, [id, user_id], async (err, result) => {
                        if(err) {
                            return res.status(500).json({ error: err })
                        }
                        console.log('Pomyślnie polubiono post o ID: ' + id)
                        const likes = await countLikes(id)
                        return res.json({ success: true, likes: likes })
                    })
                }
            })
        }
        else {
            return res.status(500).json({ error: 'Błąd!' })
        }
    })
}
export default like;