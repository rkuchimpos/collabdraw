canvas = document.getElementById('canvas')
ctx = canvas.getContext('2d');
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);
var toPaint = []
var palette = ["red", "orange", "yellow", "green", "blue", "violet", "brown", "white"];
strokeColor = palette[random(0, palette.length - 1)];

var socket = io();

canvas.onmousedown = function onmousedown(eDown) {
	toPaint.push({ x: eDown.clientX, y: eDown.clientY, drag: false });
	draw(toPaint, strokeColor);
	socket.emit('draw', {points: toPaint, color: strokeColor});
	document.onmousemove = function(eMove) {
		toPaint.push({ x: eMove.clientX, y: eMove.clientY, drag: true });
		draw(toPaint, strokeColor);
		socket.emit('draw', {points: toPaint, color: strokeColor});
	};
	document.onmouseup = function(eUp) {
		document.onmousemove = function() {};
	}
}

socket.on('draw', function(data) {
	draw(data.points, data.color)
});

// TODO: optimize so that already-drawn points are not redrawn
function draw(pts, color) {
	ctx.strokeStyle = color;
	ctx.lineJoin = "round";
	ctx.lineWidth = 5;

	for (var i = 0; i < pts.length; i++) {
		ctx.beginPath();
		ptPrev = pts[i - 1];
		pt = pts[i];
		if (pts.length >= 2 && pt.drag) {
			ctx.moveTo(ptPrev.x, ptPrev.y);
		} else {
			ctx.moveTo(pt.x - 1, pt.y); // Move it a little to give the illusion of drawing a point
		}
		ctx.lineTo(pt.x, pt.y);
		ctx.closePath();
		ctx.stroke();
	}
}

function random(lo, hi) {
	var base = Math.random();
	var randomNumber = (hi - lo) * base + lo;

	return Math.round(randomNumber);
}