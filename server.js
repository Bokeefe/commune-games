var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
var connectedUsers = {};
let currentRooms = [];

app.use(express.static(__dirname + '/dist/commune-games'));

io.on('connection', function(socket) {
  console.log('A user is connected.');

  socket.emit('currentRooms', currentRooms);

  socket.on('joinRoom', function(req, callback) {
    console.log(req);
    if (req.roomName.replace(/\s/g, '').length > 0 && req.callSign.replace(/\s/g, '').length > 0) {
      connectedUsers[socket.id] = req;

      if (!currentRooms.includes(req.roomName)) {
        currentRooms.push(req.roomName);
      } else {
        console.log('room already exists');
      }

      socket.join(req.roomName);
      socket.emit('currentRooms', currentRooms);
      socket.emit('updateRoom', currentRooms);

      socket.broadcast.to(req.roomName).emit('message', {
        callSign: 'System',
        text: req.callSign + ' has joined!',
        timestamp: moment().valueOf()
      }),
        () => {
          nameAvailable = true;
        };
    }
  });

  socket.on('message', function(message) {
    message.timestamp = moment().valueOf();
    io.to(connectedUsers[socket.id].roomName).emit('message', message);
  });

  socket.emit('message', {
    callSign: 'System',
    text: 'Hey there! Ask someone to join this chat room to start talking.',
    timestamp: moment().valueOf()
  });

  socket.on('disconnect', function() {
    var userData = connectedUsers[socket.id];
    if (typeof userData !== 'undefined') {
      socket.leave(connectedUsers[socket.id]);
      io.to(userData.roomName).emit('message', {
        callSign: 'System',
        text: userData.callSign + ' has left!',
        timestamp: moment().valueOf()
      });
      delete connectedUsers[socket.id];
    }
  });
});

http.listen(PORT, function() {
  console.log('Server started on port ' + PORT);
});
