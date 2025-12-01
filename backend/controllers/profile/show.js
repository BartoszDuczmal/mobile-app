import { promisify } from 'util';
import db from "../../config/db.js";
import schemaLogin from "../../models/loginModel.js";


const query = promisify(db.query).bind(db);

const show = async (req, res) => {
    console.log("REQ BODY:", req.body)
    const msg = "Podany użytkownik nie istnieje."

    const { error, value } = schemaLogin.extract('name').validate(req.body.name)
    if(error) {
        return res.status(400).json({ error: msg })
    }

    try {
        const qName = await query('SELECT id, username, perms, created_at FROM users WHERE username=? LIMIT 1', [req.body.name])
        if(qName.length === 0) {
            return res.status(400).json({ error: msg })
        }
        return res.json(qName[0])
    }
    catch(err) {
        return res.status(500).json({ error: 'Wystąpił wewnętrzny błąd serwera.' })
    }

}

export default show;