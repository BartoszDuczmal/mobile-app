import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

// Dane wejściowe do bazy danych

const db = mysql.createPool(process.env.DB_URL);

export default db;