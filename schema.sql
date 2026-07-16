-- schema.sql

-- 1. Create the database
CREATE DATABASE IF NOT EXISTS hotel_matrix;
USE hotel_matrix;

-- 2. Create the Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(10) NOT NULL,
    room_type VARCHAR(50) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE
);

-- 3. Create the Bookings Table with defensive links
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT,
    guest_name VARCHAR(100) NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- 4. Insert initial data into the matrix
INSERT INTO rooms (room_number, room_type) VALUES 
('101', 'Deluxe'),
('102', 'Deluxe'),
('201', 'Suite'),
('202', 'Suite');