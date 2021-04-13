// == Step 1: Create a server ofr us based on ExpressJS server. Then pass it to Socket.io in order to make it know what server we are using ==
// Import ExpressJS
const express = require('express');

// To run express function
const app = express();

// Create a server that will be required for Socket.io
const server = require('http').Server(app);

// Import Socket.io and pass the server to Socket.io
const io = require('socket.io')(server);

// Utilize 'uuid' library to generate a random ID
const { v4: uuidV4 } = require('uuid');

// == Step 2: Setup view engine ==
// Use ejs library for view engine
app.set('view engine', 'ejs');

// Setup static folder with the name : 'public'. Hence, HTML, CSS, and JS will be put inside the 'public' folder
app.use(express.static('public'));

// GET route
app.get('/', (req, res) => {
  // Redirect users to a randomly generated id as room ID
  res.redirect(`/${uuidV4()}`);
});

// Create route for rooms (dynamic parameter)
app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
});

// Admin anyone who wants to join the room
io.on('connection', socket => {
  // Whenever someone connects with socket.io, pass roomId and userId
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId);
    })
  });
});

// == Step 3 : Setup a port for server ==
// Set a port which will be used for server
server.listen(3000);
