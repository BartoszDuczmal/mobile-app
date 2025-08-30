import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import db from "../../config/db.js";
import schemaLogin from "../../models/loginModel.js";

dotenv.config();

const query = promisify(db.query).bind(db);

const login = async (req, res) => {
    const msgError = 'Nie istnieje żadne konto pasujące do podanych danych!'
    
    console.log('Otrzymano próbę logowania: ', req.body)
    
    // Walidacja otrzymanych danych
    const { error, value } = schemaLogin.validate(req.body)
    if(error) {
        console.log('Bledna walidacja! Error: ' + error)
        return res.status(400).json({ error: error.details[0].message });
    }
    
    // Logowanie użytkownika 
    try {
        const result = await query('SELECT id, email, pass, perms FROM users WHERE email = ? LIMIT 1', [value.email])
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
                console.log('Bledne haslo!')
                return res.status(401).json({ error: msgError });
            }
        }
        else {
            console.log('Brak konta o takim emailu!')
            return res.status(401).json({ error: msgError });
        }
    }
    catch(err) {
        console.log('Blad podczas zapytania do bazy! Error: ' + err)
        return res.status(500).json({ error: err });
    }
}

export default login;