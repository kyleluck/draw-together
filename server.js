var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', function(socket) {

  console.log('user connected!');

  //draw msg has x & y properties for where the dot was drawn
  socket.on('draw', function(msg) {
    socket.broadcast.emit('draw', {x: msg.x, y: msg.y});
  });

});

http.listen(8000, function() {
  console.log('Listening on 8000...');
});
