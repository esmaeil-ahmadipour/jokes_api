// socket-server.js
const http = require('http');
const { Server } = require('socket.io');
const { extendedJokes } = require('./jokes');

const PORT = 8000;
const app = require('express')(); // فقط برای ایجاد سرور HTTP پایه
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  socket.on('disconnect', () => console.log(`Client disconnected: ${socket.id}`));
});

// Random jokes broadcast
function startRandomJokes(io) {
  async function sendJoke() {
    const randomIndex = Math.floor(Math.random() * extendedJokes.length);
    const joke = extendedJokes[randomIndex];
    io.emit('joke', joke);
    console.log(`Sent joke ID ${joke.id} (${joke.type})`);
    const delay = joke.type === 'single' ? 6000 : 12000;
    setTimeout(sendJoke, delay);
  }
  sendJoke();
}

startRandomJokes(io);

server.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running at http://localhost:${PORT}`);
});
