const WebSocket = require('ws');

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('A new client connected');
    ws.on('message', (message) => {
      console.log('Received message: %s', message);
      // Broadcasting the message to all connected clients
      broadcastMessage(wss, message, ws);
    });
    ws.on('error', (error) => {
      console.error('WebSocket error:', error.stack);
    });
    ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server!' }));

  });

  wss.on('error', (error) => {
    console.error('WebSocket Server error:', error.stack);
  });
};

const broadcastMessage = (wss, message, senderWs) => {
  wss.clients.forEach((client) => {
    if (client !== senderWs && client.readyState === WebSocket.OPEN) {
      client.send(message, (error) => {
        if (error) {
          console.error('Error broadcasting message:', error.stack);
        }
      });
    }
  });
};

module.exports = { setupWebSocket };