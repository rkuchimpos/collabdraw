var canvas = document.getElementById('canvas');
canvas.height = 650;
canvas.width = 1000;
ctx = canvas.getContext('2d');
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

var btnSubmit = document.getElementById('btnsend');

var strokeColor = randcolor();
var socket = io();

var coords = {};
var coordsPrev = {};

var nick = "Guest";
function init() {
    nick = prompt('Enter nick');
    socket.emit('join', nick);
}

init();

socket.on('join', function(nick) {
    addMsg('<b>' + nick + ' joined the room</b>');
});

socket.on('leave', function(nick) {
    addMsg('<b>' + nick + ' left the room</b>');
});

socket.on('draw', function(data) {
    draw(data.coordsPrev, data.coords, data.color);
});

socket.on('msg', function(postinfo) {
    post(postinfo);
});

var msgCount = 0;
function post(postinfo) {
    if (postinfo.body == "") {
        return
    }
    addMsg("<span style='color: " + postinfo.color + "'><b>" + postinfo.nick + "</b></span> said <br/><i>" + postinfo.body + "</i>");
    msgbox.value = "";
}

function onPost() {
    var msgbox = document.getElementById('msgbox');
    var msg = msgbox.value;
    socket.emit('msg', {nick: nick, body: msg, color: strokeColor})
}

function addMsg(content) {
    var li = document.createElement('li');
    var ul = document.getElementById('messages');
    ul.insertBefore(li, ul.childNodes[0]);
    ul.childNodes[0].innerHTML = content;
}

function draw(coordsPrev, coords, color) {
    ctx.strokeStyle = color;
    ctx.lineJoin = "round";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(coordsPrev.x, coordsPrev.y);
    ctx.quadraticCurveTo(coords.x, coords.y, coords.x, coords.y);
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

// TODO: Create a method that allows string formatting, e.g. var str = format("{}. {}", [42, "Bob"]);

canvas.onmousedown = function(eDown) {
    var x = eDown.clientX;
    var y = eDown.clientY;
    coordsPrev = { x: x, y: y };
    coords = { x: x + 1, y: y };
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

btnSubmit.onclick = onPost;
document.getElementById('form').onsubmit = function(e) {
    e.preventDefault();
    onPost();
    return false;
};