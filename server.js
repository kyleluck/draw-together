var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(8000, function() {
  console.log('Listening on 8000');
});
