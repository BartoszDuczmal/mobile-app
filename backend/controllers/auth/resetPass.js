import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import db from "../../config/db.js";
import schemaLogin from '../../models/loginModel.js';

dotenv.config();

const query = promisify(db.query).bind(db);

const resetPass = async (req, res) => {
    const token = req.body.token
    if(!token) {
        return res.status(401).json({ error: "Twój token resetujący wygasł."})
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        const q1 = await query('SELECT id FROM pass_resets WHERE user_id = ? AND jti = ? AND expires_at > NOW() AND used = 0 LIMIT 1', [decoded.user, decoded.jti])
        if(q1.length === 0) {
            return res.status(401).json({ error: "Twój token resetujący wygasł."})
        }

        const { error, value } = schemaLogin.extract('pass').validate(req.body.pass);
        if (error) {
            return res.status(400).json({ error: "Niepoprawny format hasła." });
        }

        const hash = await bcrypt.hash(value, Number(process.env.SALT_ROUNDS))
        await query('UPDATE users SET pass = ? WHERE id = ?', [hash, decoded.user])
        await query('UPDATE pass_resets SET used = 1 WHERE jti = ?', [decoded.jti])
    }
    catch(err) {
        console.error('Błąd!', err)
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Twój token resetujący wygasł." });
        } else {
            return res.status(500).json({ error: "Wystąpił wewnętrzny błąd serwera." });
        }
    }
    res.json({ success: true })
    
}

export default resetPass;
