import bcrypt from 'bcrypt';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import Joi from 'joi';
import mysql from 'mysql';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const saltRounds = 10

// Dane wejściowe do bazy danych

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME,
});

// Łączenie do bazy danych

db.connect(err => {
  if (err) throw err;
  console.log('Połączono z MySQL');
});

// Pobranie wszystkich postów z bazy danych

app.get('/posts', (req, res) => {
  db.query('SELECT id, title, description, likes FROM posts ORDER BY created_at DESC', (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// Szablon walidujący dla posta

const schemaPost = Joi.object({
  title: Joi.string().min(3).max(50).required(),
  desc: Joi.string().min(3).max(400).required(),
})

// Dodanie nowego postu do bazy danych

app.post('/posts', (req, res) => {
  console.log('Otrzymano post: ', req.body)

  const { error, value } = schemaPost.validate(req.body)
  if(error) {
    console.log('Bledna walidacja! Error: ' + error)
    return res.status(400).json({ error: error.details[0].message });
  }

  const sql = 'INSERT INTO posts (title, description, likes) VALUES (?, ?, 0)' 
  db.query(sql, [value.title, value.desc], (err, result) => {
    if (err) {
      console.log('Blad podczas zapytania do bazy! Error: ' + err)
      return res.status(500).json({ error: err });
    }
    res.json({ success: true, id: result.insertId });
  })
})

// Polubianie posta - do zmiany

app.post('/posts/:id/likes', (req, res) => {
  if(req.params.id != req.body.id) {
    console.log('Numery id nie sa takie same!' + err)
    return res.status(400).json({ error: err });
  }
  console.log('Zalajkowano post o id: ' + req.body.id)

  const sql = 'UPDATE posts SET likes = likes + 1 WHERE id = ?'
  db.query(sql, [req.body.id], (err, result) => {
    if (err) {
      console.log('Blad podczas zapytania do bazy! Error: ' + err)
      return res.status(500).json({ error: err });
    }
    res.json(result);
  })
})

// Pobieranie jednego posta o danym id

app.get('/posts/:id', (req, res) => {
  const postId = req.params.id;

  if (isNaN(Number(postId))) {
  return res.status(400).json({ error: 'Nieprawidłowy identyfikator' });
  }

  const sql = 'SELECT * FROM posts WHERE id = ?';
  db.query(sql, [postId], (err, result) => {
    if (err) {
      console.error('Błąd podczas zapytania do bazy:', err);
      return res.status(500).json({ error: 'Błąd serwera' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Post nie znaleziony' });
    }

    res.json(result[0]);
  });
});


//
// AUTORYZACJA
//

// Szablon

const schemaLogin = Joi.object({
  email: Joi.string().max(50).email().required(),
  pass: Joi.string().min(8).max(30).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).+$")).required(),
})

// Logowanie

app.post('/login', (req, res) => {
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
})

// Rejestracja

app.post('/register', (req, res) => {
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
})

// Uruchomienie serwera

app.listen(3001, '0.0.0.0', () => {
  console.log('Serwer działa na porcie 3001');
});