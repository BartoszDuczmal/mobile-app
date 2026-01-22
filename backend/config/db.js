import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

// Dane wejściowe do bazy danych

const db = mysql.createPool(process.env.DB_URL);

// Łączenie do bazy danych

db.connect(err => {
  if (err) throw err;
  console.log('Połączono z MySQL');
});

export default db;