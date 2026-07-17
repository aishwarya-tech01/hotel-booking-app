const express = require('express');
const pool = require('./database'); // Connected to your XAMPP setup
const app = express();

app.use(express.json());
app.use(express.static('public'));

// ==========================================
// FEATURE 2: LIVE SEARCH ENDPOINT
// ==========================================
app.get('/api/rooms/available', async (req, res) => {
    const { check_in, check_out } = req.query;
    try {
        // SQL trick: Find rooms that are NOT currently booked for the requested dates
        const [rooms] = await pool.query(`
            SELECT * FROM rooms WHERE id NOT IN (
                SELECT room_id FROM bookings 
                WHERE (check_in_date < ? AND check_out_date > ?)
            )
        `, [check_out, check_in]);
        res.json(rooms);
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Search query failed" });
    }
});

// ==========================================
// ORIGINAL CORE: CONCURRENCY CONTROL BOOKING
// ==========================================
app.post('/api/book', async (req, res) => {
    const { room_id, guest_name, check_in, check_out } = req.body;
    
    // 1. Grab a dedicated connection for the transaction
    const connection = await pool.getConnection();

    try {
        // 2. Start the ACID Transaction
        await connection.beginTransaction();

        // 3. Race Condition Check: Is the room already booked for these exact dates?
        // We use FOR UPDATE to lock the rows being read until the transaction finishes
        const [conflicts] = await connection.query(`
            SELECT id FROM bookings 
            WHERE room_id = ? 
            AND (check_in_date < ? AND check_out_date > ?)
            FOR UPDATE
        `, [room_id, check_out, check_in]);

        // 4. If a conflict exists, ROLLBACK and send the 409 Error (from your README)
        if (conflicts.length > 0) {
            await connection.rollback();
            return res.status(409).json({ error: "Race Condition Avoided: Room was just booked by another user." });
        }

        // 5. If clear, insert the new booking
        await connection.query(
            "INSERT INTO bookings (room_id, guest_name, check_in_date, check_out_date) VALUES (?, ?, ?, ?)",
            [room_id, guest_name, check_in, check_out]
        );

        // 6. COMMIT the transaction permanently to the database
        await connection.commit();
        res.status(200).json({ message: "Booking confirmed successfully!" });

    } catch (error) {
        // 7. If anything crashes, ROLLBACK to protect database integrity
        await connection.rollback();
        console.error("Transaction failed:", error);
        res.status(500).json({ error: "Server crashed during booking process." });
    } finally {
        // 8. Always return the connection to the pool
        connection.release();
    }
});

// ==========================================
// FEATURE 3: ADMIN DASHBOARD ENDPOINT
// ==========================================
app.get('/api/admin/bookings', async (req, res) => {
    try {
        // JOIN tables to combine booking ledger with physical room details
        const [bookings] = await pool.query(`
            SELECT b.id, b.guest_name, b.check_in_date, b.check_out_date, r.room_number, r.room_type 
            FROM bookings b 
            JOIN rooms r ON b.room_id = r.id
            ORDER BY b.check_in_date ASC
        `);
        res.json(bookings);
    } catch (error) {
        console.error("Admin ledger error:", error);
        res.status(500).json({ error: "Failed to fetch ledger" });
    }
});

// ==========================================
// SERVER INITIALIZATION
// ==========================================
app.listen(3000, () => {
    console.log(`NeonVacancy Matrix running on http://localhost:3000`);
});