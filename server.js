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

const currentTeams = {
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

  socket.on('getCurrentTeams', () => {
    io.emit('currentTeams', currentTeams);
  });

  var nsp = io.of('/test');

  nsp.on('connection', function(socket){
    console.log('someone connected to test room');
  });

  nsp.emit('hi', 'everyone!');

  socket.on('disconnect', () => {

  });
});

http.listen(3000, () => {
  console.log('listening on localhost:3000');
});
