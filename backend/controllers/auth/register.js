import bcrypt from 'bcrypt';
import { promisify } from 'util';
import db from "../../config/db.js";
import schemaLogin from "../../models/loginModel.js";

const saltRounds = 10

const query = promisify(db.query).bind(db);

const register = async (req, res) => {
    console.log('Otrzymano próbę zarejestrowania: ', req.body)
    
    // Walidacja otrzymanych danych
    const { error, value } = schemaLogin.validate(req.body)
    if(error) {
      console.log('Bledna walidacja! Error: ' + error)
      return res.status(400).json({ error: error.details[0].message });
    }
    
    // Sprawdzenie czy nie istnieje juz konto o podanym emailu
    try {
      const result = await query('SELECT email, pass FROM users WHERE email = ?', [value.email])
      if(result.length === 0) {
    
          // Hashowanie hasła
          const hash = await bcrypt.hash(value.pass, saltRounds)

          // Dodanie użytkownika do bazy danych
          await query('INSERT INTO users (email, pass) VALUES (?, ?)', [value.email, hash])
        }
        else {
          console.log('Konto o takim emailu już istnieje!')
          return res.status(409).json({ error: 'Konto o takim emailu już istnieje!' });
        }
    }
    catch(err) {
      console.log('Blad! Error: ' + err)
      return res.status(500).json({ error: err });
    }

    res.json({ success: true })
}

export default register;