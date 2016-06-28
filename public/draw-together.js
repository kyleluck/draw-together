$(function() {

  //variable for drawing state
  var isDrawing = false;
  var socket = io();
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var lastMousePosition;
  var color;

  $('#color-picker').change(function() {
    color = $('#color-picker').val();
  });

  $('#canvas').mousedown(function() {
    isDrawing = true;
  });

  $('#canvas').mouseup(function() {
    isDrawing = false;
  });

  $('#canvas').mousemove(function(event) {
    if (isDrawing) {
      //draw
      var mousePosition = {
        x: event.clientX - canvas.offsetLeft,
        y: event.clientY - canvas.offsetTop
      };

      if (lastMousePosition) {
        ctx.strokeStyle = color; // or some color
        ctx.lineJoin = 'round';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(lastMousePosition.x, lastMousePosition.y);
        ctx.lineTo(mousePosition.x, mousePosition.y);
        ctx.closePath();
        ctx.stroke();
        //socket.emit('draw', {x: mousePosition.x, y: mousePosition.y});
        socket.emit('draw', {point1: {x: lastMousePosition.x, y: lastMousePosition.y}, point2: {x: mousePosition.x, y: mousePosition.y}});
      }
      lastMousePosition = mousePosition;
    }
  });

  //draw on canvas each time a draw message is received
  socket.on('draw', function(msg) {
    ctx.strokeStyle = color; // or some color
    ctx.lineJoin = 'round';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(msg.point1.x, msg.point1.y);
    ctx.lineTo(msg.point2.x, msg.point2.y);
    ctx.closePath();
    ctx.stroke();
  });

});