const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { Pool } = require('pg');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'chat_app',
  password: 'Shakthiopen12@',
  port: 5432,
});
// Serve static files
app.use(express.static(__dirname + '/public'));
// WebSocket connection handler
io.on('connection', (socket) => {
  console.log('New user connected');
  // Handle message event
  socket.on('message', (data) => {
    const { message, username } = data;
    // Store message in PostgreSQL database
    pool.query('INSERT INTO message (username, message) VALUES ($1, $2)', [username, message])
      .then(() => {
        // Broadcast message to all connected clients
        io.emit('message', { username, message });
      })
      .catch((error) => {
        console.error('Error storing message:', error);
      });
  });
  // Handle disconnection event
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
// Start server
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// login routes 
