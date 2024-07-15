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

    // Handle drawing event
    socket.on('drawing', (data) => {
      // Broadcast drawing data to all connected clients except sender
      socket.broadcast.emit('drawing', data);
    });

    // Handle clear canvas event
    socket.on('clearCanvas', () => {
      // Broadcast clear canvas command to all connected clients except sender
      socket.broadcast.emit('clearCanvas');
    });

    // Handle toggle eraser event
    socket.on('toggleEraser', (erasing) => {
      // Broadcast eraser state to all connected clients except sender
      socket.broadcast.emit('toggleEraser', erasing);
    });

    // Handle update brush settings event
    socket.on('updateBrushSettings', (settings) => {
      // Broadcast brush settings to all connected clients except sender
      socket.broadcast.emit('updateBrushSettings', settings);
    });
  });
};

module.exports = { initializeSocket };
