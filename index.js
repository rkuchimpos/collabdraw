var canvas = document.getElementById('canvas');
canvas.height = 800;
canvas.width = 1200;
ctx = canvas.getContext('2d');
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);
var strokeColor = randcolor();

var socket = io();

var coords = {};
var coordsPrev = {};

canvas.onmousedown = function(eDown) {
    var x = eDown.clientX;
    var y = eDown.clientY;
    coordsPrev = { x: x, y: y };
    coords = { x: x + 1, y: y };
    draw(coordsPrev, coords, strokeColor);
    socket.emit('draw', {
        coordsPrev: coordsPrev,
        coords: coords,
        color: strokeColor
    });
    document.onmousemove = function(eMove) {
        coords = { x: eMove.clientX, y: eMove.clientY };
        draw(coordsPrev, coords, strokeColor);
        socket.emit('draw', {
            coordsPrev: coordsPrev,
            coords: coords,
            color: strokeColor
        });
        coordsPrev = coords;
    };
    document.onmouseup = function(eUp) {
        document.onmousemove = function() {};
        coordsPrev = {};
    };
}

socket.on('draw', function(data) {
    draw(data.coordsPrev, data.coords, data.color);
});

function draw(coordsPrev, coords, color) {
    ctx.strokeStyle = color;
    ctx.lineJoin = "round";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(coordsPrev.x, coordsPrev.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.closePath();
    ctx.stroke();
}

function random(lo, hi) {
    var base = Math.random();
    var randomNumber = (hi - lo) * base + lo;

    return Math.round(randomNumber);
}

function randcolor() {
    var r = random(10, 255);
    var g = random(10, 255);
    var b = random(10, 255);

    return "rgb(" + r + "," + g + "," + b +")";
}