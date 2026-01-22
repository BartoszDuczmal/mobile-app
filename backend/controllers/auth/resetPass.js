import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import db from '../../config/db.js';
import checkFunc from '../../functions/checkFunc.js';
import schemaLogin from '../../models/loginModel.js';

dotenv.config();

const errMsg = "Twój token resetujący wygasł."

const resetPass = async (req, res) => {

    let resetToken = req.body.token
    let jwtToken
    let currPass
    let decoded
    let userId

    try {
        if(!resetToken) {

            // Zmiana hasła

            jwtToken = req.cookies.token
            currPass = req.body.curr
            
            if(!currPass || !jwtToken) {
                return res.status(401).json({ error: errMsg })
            }
            
            decoded = checkFunc(jwtToken)
            const [qCheck] = await db.query('SELECT pass FROM users WHERE id=? LIMIT 1', [decoded.id])
            const isMatch = await bcrypt.compare(currPass, qCheck[0].pass)

            if(!isMatch) return res.status(400).json({ error: "Nieprawidłowe hasło."})

            userId = decoded.id
            
        }
        else {

            // Reset hasła

            decoded = jwt.verify(resetToken, process.env.JWT_KEY)
            const [q1] = await db.query('SELECT id FROM pass_resets WHERE user_id = ? AND jti = ? AND expires_at > NOW() AND used = 0 LIMIT 1', [decoded.user, decoded.jti])
            
            if(q1.length === 0) return res.status(401).json({ error: errMsg })

            userId = decoded.user

        }

        // Zmiana hasła w bazie danych

        const { error, value } = schemaLogin.extract('pass').validate(req.body.pass);
        
        if (error) {
            return res.status(400).json({ error: "Niepoprawny format hasła." });
        }

        const hash = await bcrypt.hash(value, Number(process.env.SALT_ROUNDS))
        await db.query('UPDATE users SET pass = ? WHERE id = ?', [hash, userId])

        if(resetToken) {
            await db.query('UPDATE pass_resets SET used = 1 WHERE jti = ?', [decoded.jti])
        }

        res.json({ success: true })

    } 
    catch(err) {

        console.error('Błąd!', err)
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: errMsg });
        } else {
            return res.status(500).json({ error: "Wystąpił wewnętrzny błąd serwera." });
        }

    }

}

export default resetPass;