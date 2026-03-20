import mysql from 'mysql2/promise';

// Dane wejściowe do bazy danych

const db = mysql.createPool(process.env.DB_URL);

export default db;