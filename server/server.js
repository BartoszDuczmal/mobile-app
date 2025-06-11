import cors from 'cors';
import express from 'express';
import Joi from 'joi';
import mysql from 'mysql';

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mobile_app'
});

db.connect(err => {
  if (err) throw err;
  console.log('Połączono z MySQL');
});

//Pobranie wszystkich postów z bazy danych

app.get('/posts', (req, res) => {
  db.query('SELECT * FROM posts', (err, result) => {
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
  console.log('Otrzymano post: ' + req.body)

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
app.post('/posts/:id/likes', (req, res) => {
  if(req.params.id != req.body.id) {
    console.log('Numery id nie sa takie same!' + err)
    return res.status(999).json({ error: err });
  }
  console.log('Zalajkowano post o id: ' + req.body.id)

  const sql = 'UPDATE posts SET likes = likes + 1 WHERE id = ?'
  db.query(sql, req.body.id, (err, result) => {
    if (err) {
      console.log('Blad podczas zapytania do bazy! Error: ' + err)
      return res.status(500).json({ error: err });
    }
    res.json({ success: true });
  })
})

// Uruchomienie serwera

app.listen(3001, '0.0.0.0', () => {
  console.log('Serwer działa na porcie 3001');
});