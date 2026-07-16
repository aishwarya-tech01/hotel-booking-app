const express = require('express');
const path = require('path');
const db = require('./database'); 

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoint: Get all rooms for the frontend dropdown
app.get('/api/rooms', async (req, res) => {
    try {
        const [rooms] = await db.query('SELECT * FROM rooms');
        res.json(rooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch rooms.' });
    }
});

// API Endpoint: Book a room with protective collision check
app.post('/api/book', async (req, res) => {
    const { guestName, roomId, checkIn, checkOut } = req.body;

    if (!guestName || !roomId || !checkIn || !checkOut) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Check for overlapping dates
        const checkSQL = `
            SELECT * FROM bookings 
            WHERE room_id = ? 
            AND (
                (check_in_date <= ? AND check_out_date >= ?) OR
                (check_in_date <= ? AND check_out_date >= ?) OR
                (? <= check_in_date AND ? >= check_out_date)
            )
        `;
        
        const [existingBookings] = await connection.query(checkSQL, [
            roomId, checkOut, checkIn, checkIn, checkIn, checkIn, checkOut
        ]);

        if (existingBookings.length > 0) {
            await connection.rollback();
            return res.status(409).json({ 
                success: false, 
                message: 'Collision! Room is already booked for these dates.' 
            });
        }

        const insertSQL = `
            INSERT INTO bookings (room_id, guest_name, check_in_date, check_out_date) 
            VALUES (?, ?, ?, ?)
        `;
        await connection.query(insertSQL, [roomId, guestName, checkIn, checkOut]);

        await connection.query('UPDATE rooms SET is_available = FALSE WHERE id = ?', [roomId]);

        await connection.commit();
        res.json({ success: true, message: 'Success: Room locked and booked!' });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error during transaction.' });
    } finally {
        connection.release();
    }
});

app.listen(PORT, () => {
    console.log(`NeonVacancy Server running on http://localhost:${PORT}`);
});