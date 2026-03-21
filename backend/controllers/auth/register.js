import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import db from '../../config/db.js';
import schemaLogin from "../../models/loginModel.js";

dotenv.config()

const saltRounds = Number(process.env.SALT_ROUNDS)

const register = async (req, res) => {
    
    // Walidacja otrzymanych danych
    const { error, value } = schemaLogin.validate(req.body)
    if(error) {
      return res.status(400).json({ error: 'auth.register.incorrect' });
    }
    
    // Sprawdzenie czy nie istnieje juz konto o podanym emailu
    try {
      const [qEmail] = await db.query('SELECT id FROM users WHERE email = ?', [value.email])
      if(qEmail.length === 0) {

          // Sprawdzenie czy nie istnieje juz konto o podanej nazwie uzytkownika
          const [qName] = await db.query('SELECT id FROM users WHERE username = ?', [value.name])
          if(qName.length === 0) {

            // Hashowanie hasła
            const hash = await bcrypt.hash(value.pass, saltRounds)

            // Dodanie użytkownika do bazy danych
            await db.query('INSERT INTO users (username, email, pass) VALUES (?, ?, ?)', [value.name, value.email, hash])
          }
          else {
            return res.status(409).json({ error: 'auth.register.alreadyTakenUsername' });
          }
      }
      else {
        return res.status(409).json({ error: 'auth.register.alreadyTakenEmail' });
      }
    }
    catch(err) {
      return res.status(500).json({ error: 'common.internalErr' });
    }

    res.json({ success: true })
}

export default register;