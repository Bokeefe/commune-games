/* jshint esversion:6 */
var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var publicPath = path.resolve(__dirname, 'dist/commune-games');

app.use(express.static(publicPath));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/dist/commune-games/index.html');
});

const currentRooms = {
  'cats': {
    gameId: 1,
    players: []
  },
  'rats': {
    gameId: 2,
    players: []
  }
};

io.on('connection', (socket) => {

  console.log('connected to main');

  socket.on('getCurrentRooms', () => {
    io.emit('currentRooms', currentRooms);
  });

  socket.on('joinRoom', (roomName) => {
    console.log('joinRoom', roomName);
    socket.join(roomName);
  });

  socket.on('inRoom', (data) => {
    console.log(data);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected');
  });
});


http.listen(3000, () => {
  console.log('listening on localhost:3000');
});
