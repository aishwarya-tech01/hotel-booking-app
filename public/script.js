document.addEventListener('DOMContentLoaded', async () => {
    const roomSelect = document.getElementById('roomSelect');
    const bookingForm = document.getElementById('bookingForm');
    const statusMessage = document.getElementById('statusMessage');

    // 1. Fetch available rooms on page load
    try {
        const response = await fetch('/api/rooms');
        const rooms = await response.json();
        
        roomSelect.innerHTML = '<option value="">-- Select Chamber --</option>';
        
        rooms.forEach(room => {
            const option = document.createElement('option');
            option.value = room.id;
            // E.g., Room 101 (Deluxe)
            option.textContent = `Room ${room.room_number} (${room.room_type})`;
            roomSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading rooms:', error);
        roomSelect.innerHTML = '<option value="">Error loading matrix</option>';
    }

    // 2. Handle form submission
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent page reload

        // Gather data from the form
        const bookingData = {
            guestName: document.getElementById('guestName').value,
            roomId: document.getElementById('roomSelect').value,
            checkIn: document.getElementById('checkIn').value,
            checkOut: document.getElementById('checkOut').value
        };

        // Send data to the backend
        try {
            const response = await fetch('/api/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookingData)
            });

            const result = await response.json();

            // Display success or error message
            statusMessage.classList.remove('hidden', 'success', 'error');
            statusMessage.textContent = result.message;

            if (result.success) {
                statusMessage.classList.add('success');
                bookingForm.reset(); // Clear the form on success
            } else {
                statusMessage.classList.add('error');
            }
        } catch (error) {
            console.error('Transaction failed:', error);
            statusMessage.classList.remove('hidden', 'success');
            statusMessage.classList.add('error');
            statusMessage.textContent = 'CRITICAL ERROR: Unable to process transaction.';
        }
    });
});