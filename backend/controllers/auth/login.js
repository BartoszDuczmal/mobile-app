import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Joi from "joi";
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import db from "../../config/db.js";
import schemaLogin from "../../models/loginModel.js";

dotenv.config();

const query = promisify(db.query).bind(db);

const login = async (req, res) => {
    const msgError = 'Nieprawidłowy login lub hasło.'
    
    console.log('Otrzymano próbę logowania: ', req.body)
    
    // Walidacja otrzymanych danych
    const vPass = schemaLogin.extract('pass').validate(req.body.pass)
    if(vPass.error) {
        console.log('Bledne hasło. Error: ' + vPass.error)
        return res.status(400).json({ error: msgError })
    }
    const vLogin = Joi.string().min(3).max(50).required().validate(req.body.login)
    if(vLogin.error) {
        console.log('Bledny login. Error: ' + vLogin.error)
        return res.status(400).json({ error: msgError })
    }
    
    // Logowanie użytkownika 
    try {
        const result = await query('SELECT id, pass, perms FROM users WHERE email = ? OR username = ? LIMIT 1', [req.body.login, req.body.login])
        if(result.length > 0) {
            const isMatch = await bcrypt.compare(req.body.pass, result[0].pass)
            if(isMatch) {

                // Nadawanie użytkownikowi tokenu JWT
                const token = jwt.sign({ id: result[0].id, perm: result[0].perms }, process.env.JWT_KEY, { expiresIn: '1h' });
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
                console.log('Nieprawidłowy login lub hasło.')
                return res.status(401).json({ error: msgError });
            }
        }
        else {
            console.log('Nieprawidłowy login lub hasło.')
            return res.status(401).json({ error: msgError });
        }
    }
    catch(err) {
        console.log('Blad podczas zapytania do bazy. Error: ' + err)
        return res.status(500).json({ error: 'Wystąpił wewnętrzny błąd serwera.' });
    }
}

export default login;