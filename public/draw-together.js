$(function() {

  var isDrawing = false; //variable for drawing state
  var socket = io();
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var lastMousePosition; //keep track of the last mouse position
  var color = $('#color-picker').val(); //color to draw
  var thickness = $('#pen-thickness').val(); //thickness of pen
  var eraser = false; //are we using the eraser?
  var roomName; //what room are we in?

  //on initial load, ask user to join or create a room
  //once that form is submitted, hide the associated div and display the canvas
  $("#join-room-form").submit(function() {
    $("#controls").removeClass('hidden');
    $("#canvas").removeClass('hidden');
    $('#join-room').hide();
    if ($('#room-name').val() === "") {
      roomName = $("#available-rooms option:selected").text();
    } else {
      roomName = $('#room-name').val();
    }
    socket.emit('room', roomName);
    $('#title').append(" - Room: " + roomName);
    return false;
  });

  $('#switch-room').change(function() {
    socket.emit('leaveRoom', roomName); //leave current room
    roomName = $("#switch-room option:selected").text();
    socket.emit('room', roomName); //join new room

    //fill canvas with white as new room canvas will be redrawn
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 600, 600);

    //update room name in title
    $('#title').text('Draw Together - Room: ' + roomName);
  });

  $('#color-picker').change(function() {
    color = $('#color-picker').val();
  });

  $('#pen-thickness').change(function() {
    thickness = $('#pen-thickness').val();
  });

  $('#eraser').change(function() {
    eraser = $('#eraser').is(':checked') ? true : false;
    if (eraser) {
      color = 'white';
    } else {
      color = $('#color-picker').val();
    }
  });

  $('#canvas').mousedown(function() {
    isDrawing = true;
  });

  $('#canvas').mouseup(function() {
    isDrawing = false;
    lastMousePosition = null;
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
        ctx.lineWidth = thickness;
        ctx.beginPath();
        ctx.moveTo(lastMousePosition.x, lastMousePosition.y);
        ctx.lineTo(mousePosition.x, mousePosition.y);
        ctx.closePath();
        ctx.stroke();
        socket.emit('draw', {point1: {x: lastMousePosition.x, y: lastMousePosition.y},
                             point2: {x: mousePosition.x, y: mousePosition.y},
                             color: color,
                             thickness: thickness});
      }
      lastMousePosition = mousePosition;
    }
  });

  //draw on canvas each time a draw message is received
  socket.on('draw', function(msg) {
    ctx.strokeStyle = msg.color; // or some color
    ctx.lineJoin = 'round';
    ctx.lineWidth = msg.thickness;
    ctx.beginPath();
    ctx.moveTo(msg.point1.x, msg.point1.y);
    ctx.lineTo(msg.point2.x, msg.point2.y);
    ctx.closePath();
    ctx.stroke();
  });

  //on rooms message, show available rooms. rooms is an array
  socket.on('rooms', function(rooms) {
    rooms.forEach(function(room) {
      $('#available-rooms, #switch-room').append('<option value="' + room + '">' + room + '</option>');
    });
  });

  socket.on('room', function(room) {
    $('#available-rooms, #switch-room').append('<option value="' + room + '">' + room + '</option>');
  });

});
