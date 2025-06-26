import bcrypt from 'bcrypt';
import db from "../../config/db.js";
import schemaLogin from "../../models/loginModel.js";

const login = (req, res) => {
    const msgError = 'Nie istnieje żadne konto pasujące do podanych danych!'
    
    console.log('Otrzymano próbę logowania: ', req.body)
    
    const { error, value } = schemaLogin.validate(req.body)
    if(error) {
        console.log('Bledna walidacja! Error: ' + error)
        return res.status(400).json({ error: error.details[0].message });
    }
    
    const sql = 'SELECT email, pass FROM users WHERE email = ?' 
    db.query(sql, [value.email], (err, result) => {
        if(err) {
          console.log('Blad podczas zapytania do bazy! Error: ' + err)
          return res.status(500).json({ error: err });
        }
    
        if(result.length > 0) {
            bcrypt.compare(req.body.pass, result[0].pass, (err, isMatch) => {
                if(err) {
                    return res.status(500).json({ error: 'Blad serwera!' });
                }
                if(isMatch) {
                    res.json({ success: true, key: 'jwt' }); 
                }
                else {
                    console.log('Bledne haslo!')
                    return res.status(404).json({ error: msgError });
                }
            })
        }
        else {
            console.log('Brak konta o takim emailu!')
            return res.status(404).json({ error: msgError });
        }
    })
}

export default login;