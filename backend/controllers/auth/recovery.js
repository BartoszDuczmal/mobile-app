import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import db from '../../config/db.js';
import sendMail from '../../config/mail.cjs';
import schemaLogin from "../../models/loginModel.js";

const recovery = async (req, res) => {

    // Walidacja otrzymanych danych
    const { error, value } = schemaLogin.extract('email').validate(req.body.email)
    if(error) {
      return res.status(400).json({ error: "auth.recovery.incorrect" });
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
            const token = jwt.sign({ jti: jti, user: result[0].id }, process.env.JWT_KEY, { expiresIn: '15m' });
            const resetLink = `https://mobile-app-ochre-two.vercel.app?token=${token}`
            console.log(process.env.EMAIL_USER)

            const emailContent = (req.body.lng === 'pl') ? 
            `
                <h2>Cześć!</h2>
                <h3>Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta w aplikacji mobile_app. Kliknij poniższy przycisk, aby ustawić nowe hasło:</h3>
                <br>
                <a href="${resetLink}" target="_blank" style="background-color: #4974d7; border-radius: 20px; font-weight: bold; color: #ffffff; padding: 15px 25px; text-decoration: none;">Zmień hasło</a>
                <br><br><br>
                <p>Link wygaśnie za 15 minut. Jeśli to nie Ty wysłałeś prośbę, po prostu zignoruj tę wiadomość – Twoje hasło pozostanie bezpieczne.
                <br><br><br>
                <p>Jeśli przycisk nie działa, skopiuj i wklej poniższy link do swojej przeglądarki: <br>${resetLink}</p>
            `
            :
            `
                <h2>Hey!</h2>
                <h3>We received a request to reset the password for your account in mobile_app. Click the button below to set a new password:</h3>
                <br>
                <a href="${resetLink}" target="_blank" style="background-color: #4974d7; border-radius: 20px; font-weight: bold; color: #ffffff; padding: 15px 25px; text-decoration: none;">Change password</a>
                <br><br><br>
                <p>This link will expire in 15 minutes. If you did not make this request, simply ignore this message – your password will remain secure.</p>
                <br><br><br>
                <p>If the button doesn't work, copy and paste the following link into your browser: <br>${resetLink}</p>
            `

            try {
                await sendMail({
                    to: value,
                    subject: (req.body.lng === 'pl') ? 'Resetowanie hasła.' : 'Password reset.',
                    htmlContent: emailContent
                });
            } catch(err) {
                return res.status(500).json({ error: "auth.recovery.mailSystem" });
            }

            res.json({ success: 'true', token: token })
        }
        catch(err) {
            return res.status(500).json({ error: 'common.internalErr' })
        }
    }
    catch(err) {
        return res.status(500).json({ error: 'common.internalErr' })
    }
    
}

export default recovery;