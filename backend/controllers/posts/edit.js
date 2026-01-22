import db from '../../config/db.js';
import checkFunc from '../../functions/checkFunc.js';
import schemaPost from '../../models/postModel.js';

const edit = async (req, res) => {

    // Pobieranie ID postu z url
    const postId = parseInt(req.params.id, 10)
    if(isNaN(postId)) {
        return res.status(400).json({ error: 'Nie znaleziono wpisu.' });
    }

    // Walidacja otrzymanych danych
    const { error, value } = schemaPost.validate(req.body)
    if(error) {
        console.log('Bledna walidacja! Error: ' + error)
        return res.status(400).json({ error: 'Błędny format wpisu.' });
    }

    // Pobieranie ID użytkownika
    const user = checkFunc(req.cookies.token)
    if(user === null) {
        return res.status(401).json({ error: 'Musisz się najpierw zalogować.' })
    }

    // Sprawdzanie czy użytkownik może edytować post
    if(user.perm !== 'admin') {
        const [qAuthor] = await db.query('SELECT id FROM posts WHERE id = ? AND author = ? LIMIT 1', [postId, user.id])
        if(qAuthor.length === 0) {
            return res.status(403).json({ error: 'Nie możesz wykonać tej czynności.'})
        }
    }

    // Edycja danych postu
    try {
        const [qEdit] = await db.query('UPDATE posts SET title = ?, description = ? WHERE id = ?', [value.title, value.desc, postId])
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({ error: err })
    }

    res.json({ success: true })
}

export default edit;