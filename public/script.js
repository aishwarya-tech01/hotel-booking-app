document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    const checkIn = document.getElementById('searchCheckIn').value;
    const checkOut = document.getElementById('searchCheckOut').value;

    const res = await fetch(`/api/rooms/available?check_in=${checkIn}&check_out=${checkOut}`);
    const rooms = await res.json();

    const resultsDiv = document.getElementById('searchResults');
    
    if (rooms.length === 0) {
        resultsDiv.innerHTML = '<p style="color: #ff007f; margin-top: 15px;">No rooms available for these dates.</p>';
        return;
    }

    let html = '<table><tr><th>Room ID</th><th>Room Number</th><th>Room Type</th></tr>';
    rooms.forEach(r => {
        html += `<tr><td>${r.id}</td><td>${r.room_number}</td><td>${r.room_type}</td></tr>`;
    });
    html += '</table>';
    
    resultsDiv.innerHTML = html;
});

document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const payload = {
        room_id: document.getElementById('roomId').value,
        guest_name: document.getElementById('guestName').value,
        check_in: document.getElementById('bookCheckIn').value,
        check_out: document.getElementById('bookCheckOut').value
    };

    const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        alert('Booking successfully written to database!');
        document.getElementById('bookingForm').reset();
        document.getElementById('searchResults').innerHTML = ''; // Clear search results on success
    } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error}`);
    }
});