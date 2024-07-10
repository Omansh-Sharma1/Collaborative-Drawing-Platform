const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const initializeSocket = (server) => {
  const io = new Server(server);

  io.on('connection', (socket) => {
    const sessionId = uuidv4(); // Generate unique session ID

    // Send session ID to the client
    socket.emit('sessionId', sessionId);
    console.log(`User connected with session ID: ${sessionId}`);

    // Handle user disconnection
    socket.on('disconnect', () => {
      console.log(`User with session ID ${sessionId} disconnected`);
    });

    // Handle drawing event (example)
    socket.on('drawing', (data) => {
      // Broadcast drawing data to all connected clients except sender
      socket.broadcast.emit('drawing', data);
    });
  });
};

module.exports = { initializeSocket };
