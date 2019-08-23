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
		if (req.roomName.replace(/\s/g, "").length > 0 && req.callSign.replace(/\s/g, "").length > 0) {
			var nameTaken = false;

			Object.keys(connectedUsers).forEach(function(socketId) {
				var userInfo = connectedUsers[socketId];
				if (userInfo.callSign.toUpperCase() === req.callSign.toUpperCase()) {
					nameTaken = true;
				}
			});

			if (nameTaken) {
				callback({
					nameAvailable: false,
					error: 'Sorry this callSign is taken!'
				});
			} else {
        connectedUsers[socket.id] = req;
        currentRooms.push(req.roomName);
        console.log(currentRooms);
        socket.join(req.roomName);
        
				socket.broadcast.to(req.roomName).emit('message', {
					callSign: 'System',
					text: req.callSign + ' has joined!',
					timestamp: moment().valueOf()
				}),() => {
          nameAvailable = true;
        }
			}
		} else {
			callback({
				nameAvailable: false,
				error: 'Hey, please fill out the form!'
			});
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