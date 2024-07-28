const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const initializeSocket = (server) => {
  const io = new Server(server);
  const activeRooms = new Set();

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('createRoom', () => {
      const roomId = uuidv4();
      activeRooms.add(roomId);
      socket.join(roomId);
      socket.emit('roomCreated', roomId);
      console.log(`Room created with ID: ${roomId}`);
    });

    socket.on('joinRoom', ({ roomId }) => {
      if (activeRooms.has(roomId)) {
        socket.join(roomId);
        socket.emit('roomJoined', roomId);
        console.log(`User joined room with ID: ${roomId}`);
      } else {
        socket.emit('roomNotFound', roomId);
        console.log(`Room with ID: ${roomId} not found`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });

    // Handle drawing event
    socket.on('drawing', (data) => {
      io.to(data.roomId).emit('drawing', data); // Broadcast to all clients in the room, including the sender
    });

    // Handle clear canvas event
    socket.on('clearCanvas', (roomId) => {
      io.to(roomId).emit('clearCanvas'); // Broadcast to all clients in the room, including the sender
    });

    // Handle toggle eraser event
    socket.on('toggleEraser', ({ roomId, erasing }) => {
      io.to(roomId).emit('toggleEraser', erasing); // Broadcast to all clients in the room, including the sender
    });

    // Handle update brush settings event
    socket.on('updateBrushSettings', ({ roomId, settings }) => {
      io.to(roomId).emit('updateBrushSettings', settings); // Broadcast to all clients in the room, including the sender
    });
  });
};

module.exports = { initializeSocket };
