const socketIo = require('socket.io');

const setupWebSocket = (server) => {
  const io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('A new client connected', socket.id);

    // Joining a specific room for a project
    socket.on('joinProject', (projectId) => {
      console.log(`Client ${socket.id} joined project ${projectId}`);
      socket.join(projectId);
    });

    // Handling text messages in project rooms
    socket.on('projectMessage', ({ projectId, message }) => {
      console.log(`Message in project ${projectId}: ${message}`);
      io.to(projectId).emit('newMessage', message);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected', socket.id);
    });
  });
};

module.exports = { setupWebSocket };