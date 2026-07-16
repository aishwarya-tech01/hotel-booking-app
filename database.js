const mysql = require('mysql2');

// Configure the connection pool for XAMPP MySQL engine
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // XAMPP default is completely empty string (no password)
    database: 'hotel_matrix',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Structural check to verify connection upon backend startup
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed! Error details:', err.message);
    } else {
        console.log('Successfully connected to the XAMPP MySQL database!');
        connection.release(); // Return connection back to pool inventory
    }
});

// Export promise-based wrapper for clean async/await syntax in server.js
module.exports = pool.promise();