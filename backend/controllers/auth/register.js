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
      return res.status(400).json({ error: 'Błędny format emaila lub hasła.' });
    }
    
    // Sprawdzenie czy nie istnieje juz konto o podanym emailu
    try {
      const result = await query('SELECT email, pass FROM users WHERE email = ?', [value.email])
      if(result.lenght === 0) {
    
          // Hashowanie hasła
          const hash = await bcrypt.hash(value.pass, saltRounds)

          // Dodanie użytkownika do bazy danych
          await query('INSERT INTO users (email, pass) VALUES (?, ?)', [value.email, hash])
        }
        else {
          console.log('Konto o takim emailu już istnieje!')
          return res.status(409).json({ error: 'Konto o takim emailu już istnieje.' });
        }
    }
    catch(err) {
      console.log('Blad! Error: ' + err)
      return res.status(500).json({ error: 'Wystąpił wewnętrzny błąd serwera.' });
    }

    res.json({ success: true })
}

export default register;