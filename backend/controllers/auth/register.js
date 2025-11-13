import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { promisify } from 'util';
import db from "../../config/db.js";
import schemaLogin from "../../models/loginModel.js";

dotenv.config()

const saltRounds = Number(process.env.SALT_ROUNDS)

const query = promisify(db.query).bind(db);

const register = async (req, res) => {
    console.log('Otrzymano próbę zarejestrowania: ', req.body)
    
    // Walidacja otrzymanych danych
    const { error, value } = schemaLogin.validate(req.body)
    if(error) {
      console.log('Bledna walidacja! Error: ' + error)
      return res.status(400).json({ error: 'Błędny format danych.' });
    }
    
    // Sprawdzenie czy nie istnieje juz konto o podanym emailu
    try {
      const qEmail = await query('SELECT id FROM users WHERE email = ?', [value.email])
      if(qEmail.length === 0) {

          // Sprawdzenie czy nie istnieje juz konto o podanej nazwie uzytkownika
          const qName = await query('SELECT id FROM users WHERE username = ?', [value.name])
          if(qName.length === 0) {

            // Hashowanie hasła
            const hash = await bcrypt.hash(value.pass, saltRounds)

            // Dodanie użytkownika do bazy danych
            await query('INSERT INTO users (username, email, pass) VALUES (?, ?, ?)', [value.name, value.email, hash])
          }
          else {
            console.log('Konto o takiej nazwie użytkownika już istnieje!')
            return res.status(409).json({ error: 'Wpisana nazwa użytkownika jest już zajęta.' });
          }
      }
      else {
        console.log('Konto o takim emailu już istnieje!')
        return res.status(409).json({ error: 'Konto z takim emailem już istnieje.' });
      }
    }
    catch(err) {
      console.log('Blad! Error: ' + err)
      return res.status(500).json({ error: 'Wystąpił wewnętrzny błąd serwera.' });
    }

    res.json({ success: true })
}

export default register;