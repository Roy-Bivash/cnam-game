import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

export async function initDb() {
    return new Promise((resolve, reject) => {
        // Open the SQLite database (or create it if it doesn't exist)
        const db = new sqlite3.Database('./src/database/blob/database.sqlite', (err) => {
            if (err) {
                return reject(err);
            }
            console.log('Connected to the SQLite database.');

            // Read and execute the SQL file to create tables and insert default data
            const sqlFilePath = path.resolve('./src/database/database.sql');
            const sqlQueries = fs.readFileSync(sqlFilePath, 'utf-8');

            db.exec(sqlQueries, (execErr) => {
                if (execErr) {
                    return reject(execErr);
                }
                console.log('Database tables created or verified.');
                resolve(db);
            });
        });
    });
}


