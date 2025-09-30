const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const db = require('./database'); // your SQLite db

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

// Handle rental form submission
app.post('/submit', (req, res) => {
    const { name, phone, cart } = req.body;

    if (!cart) {
        return res.send('Cart is empty!');
    }

    // Parse cart JSON
    let cartItems;
    try {
        cartItems = JSON.parse(cart);
    } catch (err) {
        console.error(err);
        return res.send('Error parsing cart data.');
    }

    // Save each cart item
    let stmt = db.prepare(`INSERT INTO rentals (name, phone, item, quantity, total) VALUES (?, ?, ?, ?, ?)`);
    cartItems.forEach(item => {
        stmt.run(name, phone, item.itemName, item.quantity, item.subtotal);
    });
    stmt.finalize();

    // Also save to .txt
    const logEntries = cartItems.map(item => 
        `${new Date().toISOString()} | ${name} | ${phone} | ${item.itemName} | ${item.quantity} | ${item.subtotal}`
    ).join('\n') + '\n';

    fs.appendFile('rentals.txt', logEntries, err => {
        if (err) console.error(err);
    });

    res.send('Rental saved successfully!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
