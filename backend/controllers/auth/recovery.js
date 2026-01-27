import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import db from '../../config/db.js';
import sendMail from '../../config/mail.cjs';
import schemaLogin from "../../models/loginModel.js";

const recovery = async (req, res) => {

    // Walidacja otrzymanych danych
    const { error, value } = schemaLogin.extract('email').validate(req.body.email)
    if(error) {
      console.log('Bledna walidacja! Error: ' + error)
      return res.status(400).json({ error: "Niepoprawny format emaila." });
    }

    try {
        const [result] = await db.query('SELECT id FROM users WHERE email = ? LIMIT 1', [value])
        if(result.length === 0) {
            return res.json({ success: false })
        }
        try {
            const jti = uuidv4()
            await db.query('INSERT INTO pass_resets (jti, user_id) VALUES (?, ?)', [jti, result[0].id])
            await db.query('DELETE FROM pass_resets WHERE user_id = ? AND id NOT IN ( SELECT id FROM ( SELECT id FROM pass_resets WHERE user_id = ? ORDER BY created_at DESC LIMIT 3 ) AS recent )', [result[0].id, result[0].id])
            const token = jwt.sign({ jti: jti, user: result[0].id }, process.env.JWT_KEY, { expiresIn: '10m' });
            const resetLink = `https://mobile-app-ochre-two.vercel.app?token=${token}`
            console.log(process.env.EMAIL_USER)

            try {
                await sendMail({
                    to: value,
                    subject: 'Resetowanie hasła.',
                    htmlContent: 
                    `
                        <h2>Aby zmienić hasło do konta kliknij w przycisk poniżej.</h2>
                        <a href="${resetLink}" target="_blank">Zmień hasło</a>
                    `
                });
            } catch(err) {
                console.error('Błąd poczty:', error);
                return res.status(500).json({ error: 'Wystąpił błąd poczty.' });
            }

            res.json({ success: 'true', token: token })
        }
        catch(err) {
            console.error('Blad podczas wysylania!', err)
            return res.status(500).json({ error: 'Wystąpił wewnętrzny błąd serwera.' })
        }
    }
    catch(err) {
        console.error('Blad!', err)
        return res.status(500).json({ error: 'Wystąpił wewnętrzny błąd serwera.' })
    }
    
}

export default recovery;