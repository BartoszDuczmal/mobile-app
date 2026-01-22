import dotenv from 'dotenv';
import mysql from 'mysql';

dotenv.config();

// Dane wejściowe do bazy danych

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectTimeout: 10000
});

// Łączenie do bazy danych

db.connect(err => {
  if (err) throw err;
  console.log('Połączono z MySQL');
});

export default db;