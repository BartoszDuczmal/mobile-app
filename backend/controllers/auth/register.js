import bcrypt from 'bcrypt'
import db from "../../config/db.js"
import schemaLogin from "../../models/loginModel.js"

const saltRounds = 10

const register = (req, res) => {
    console.log('Otrzymano próbę zarejestrowania: ', req.body)
    
    const { error, value } = schemaLogin.validate(req.body)
    if(error) {
        console.log('Bledna walidacja! Error: ' + error)
        return res.status(400).json({ error: error.details[0].message });
    }
    
    // Sprawdzenie czy nie istnieje juz konto o podanym emailu
    
    const sql = 'SELECT email, pass FROM users WHERE email = ?'
    db.query(sql, [value.email], (err, result) => {
        if(err) {
          console.log('Blad podczas zapytania do bazy! Error: ' + err)
          return res.status(500).json({ error: err });
        }
        
        if(result.length === 0) {
    
          // Hashowanie hasła
    
          bcrypt.hash(value.pass, saltRounds, (err, hash) => {
            if (err) {
              console.log('Błąd podczas hashowania hasła:', err);
              return res.status(500).json({ error: 'Błąd serwera!' });
            }
    
            // Dodanie użytkownika do bazy danych
    
            const sql = 'INSERT INTO users (email, pass) VALUES (?, ?)'
            db.query(sql, [value.email, hash], (err, result) => {
              if(err) {
                console.log('Blad podczas zapytania do bazy! Error: ' + err)
                return res.status(500).json({ error: err });
              }
              res.json({ success: true })
            })
          })
        }
        else {
          console.log('Konto o takim emailu już istnieje!')
          return res.status(404).json({ error: 'Konto o takim emailu już istnieje!' });
        }
    })
}

export default register;