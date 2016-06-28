$(function() {

  //variable for drawing state
  var isDrawing = false;
  var socket = io();
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  $('#canvas').mousedown(function() {
    isDrawing = true;
  });

  $('#canvas').mouseup(function() {
    isDrawing = false;
  });

  $('#canvas').mousemove(function(event) {
    if (isDrawing) {
      //draw
      var xLocation = event.clientX - canvas.offsetLeft;
      var yLocation = event.clientY - canvas.offsetTop;
      ctx.beginPath();
      ctx.ellipse(xLocation, yLocation, 1, 1, 0, 0, Math.PI * 2);
      ctx.fill();
      socket.emit('draw', {x: xLocation, y: yLocation});
    }
  });

  //draw on canvas each time a draw message is received
  socket.on('draw', function(msg) {
    ctx.beginPath();
    ctx.ellipse(msg.x, msg.y, 1, 1, 0, 0, Math.PI * 2);
    ctx.fill();
  });

});
