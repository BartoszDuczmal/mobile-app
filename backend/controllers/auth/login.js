import bcrypt from 'bcrypt';
import Joi from "joi";
import jwt from 'jsonwebtoken';
import db from '../../config/db.js';
import schemaLogin from "../../models/loginModel.js";

const login = async (req, res) => {
    const msgError = 'auth.login.incorrect'
    
    // Walidacja otrzymanych danych
    const vPass = schemaLogin.extract('pass').validate(req.body.pass)
    if(vPass.error) {
        return res.status(400).json({ error: msgError })
    }
    const vLogin = Joi.string().min(3).max(50).required().validate(req.body.login)
    if(vLogin.error) {
        return res.status(400).json({ error: msgError })
    }
    
    // Logowanie użytkownika 
    try {
        const [result] = await db.query('SELECT id, pass, perms FROM users WHERE email = ? OR username = ? LIMIT 1', [req.body.login, req.body.login])
        if(result.length > 0) {
            const isMatch = await bcrypt.compare(req.body.pass, result[0].pass)
            if(isMatch) {

                // Nadawanie użytkownikowi tokenu JWT
                const token = jwt.sign({ id: result[0].id, perm: result[0].perms }, process.env.JWT_KEY, { expiresIn: '30m' });
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Strict',
                    maxAge: 30 * 60 * 1000, // 30 minut
                    path: '/',
                });

                res.json({ success: true }); 
            }
            else {
                return res.status(401).json({ error: msgError });
            }
        }
        else {
            return res.status(401).json({ error: msgError });
        }
    }
    catch(err) {
        return res.status(500).json({ error: 'common.internalErr' });
    }
}

export default login;