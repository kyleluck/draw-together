var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

var drawingState = []; //store messages so drawing can render for users newly joining

io.on('connection', function(socket) {

  //join user to their room
  socket.on('room', function(room) {
    socket.join(room);
    socket.room = room;

    //send all messages of current state to new user
    drawingState.forEach(function(msg) {
      if (msg.room === room) {
        socket.emit('draw', msg.message);
      }
    });
  });

  //draw msg has 2 points with x & y properties for where the line
  //started (point1) and where the line ends (point2)
  socket.on('draw', function(msg) {
    drawingState.push({message: msg, room: socket.room});
    socket.broadcast.to(socket.room).emit('draw', {point1: {x: msg.point1.x, y: msg.point1.y},
                                   point2: {x: msg.point2.x, y: msg.point2.y},
                                   color: msg.color, thickness: msg.thickness});
  });

});

http.listen(8000, function() {
  console.log('Listening on 8000...');
});
