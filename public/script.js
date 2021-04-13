const socket = io('/');

const videoGrid = document.getElementById('video-grid');

const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
});

const myVideo = document.createElement('video');

// Mute the user's voice itself
myVideo.muted = true;

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id);
});

socket.emit('join-room', ROOM_ID, 10);

socket.on('user-connected', userId => {
  console.log('A user connected :', userId);
});
