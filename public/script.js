const socket = io('/');

const videoGrid = document.getElementById('video-grid');

const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
});

const myVideo = document.createElement('video');

// Mute the user's voice itself
myVideo.muted = true;

const peers = {};

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true,
}).then(stream => {
  addVideoStream(myVideo, stream);

  myPeer.on('call', call => {
    call.answer(stream);
    const video = document.createElement('video');
    
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream);
    });
  });

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream);
  });
});

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close();
});

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
  // Calling a user with ID of userId and sending our audio and video stream
  const call = myPeer.call(userId, stream);
  const video = document.createElement('video');
  
  call.on('close', () => {
    video.remove();
  });
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  
  videoGrid.append(video);
}
