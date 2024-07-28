document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  const sessionForm = document.getElementById('sessionForm');
  const createRoomBtn = document.getElementById('createRoomBtn');
  const joinRoomBtn = document.getElementById('joinRoomBtn');
  const roomIdInput = document.getElementById('roomIdInput');

  sessionForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(sessionForm);
    const userName = formData.get('userName');
    
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userName })
      });

      if (!response.ok) {
        throw new Error('Failed to log in');
      }

      // Handle successful login if needed
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  });

  createRoomBtn.addEventListener('click', () => {
    socket.emit('createRoom');
  });

  joinRoomBtn.addEventListener('click', () => {
    const roomId = roomIdInput.value.trim();
    if (roomId) {
      socket.emit('joinRoom', { roomId });
    }
  });

  socket.on('roomCreated', (roomId) => {
    console.log(`Room created with ID: ${roomId}`);
    window.location.href = `/canvas.html?roomId=${roomId}`;
  });

  socket.on('roomJoined', (roomId) => {
    console.log(`Joined room with ID: ${roomId}`);
    window.location.href = `/canvas.html?roomId=${roomId}`;
  });
});
