const sqlite3 = require('sqlite3').verbose();

// Open or create the database
const db = new sqlite3.Database('rental.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to rental database.');
    }
});

// Create rentals table
db.run(`CREATE TABLE IF NOT EXISTS rentals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    item TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    total INTEGER NOT NULL
)`);

module.exports = db;
