// Dependencies
var express = require('express');
var app = express();

var http = require('http');
var server = http.Server(app);

var socketIO = require('socket.io');
var io = socketIO(server);

var path = require('path');

var users = {}


var moneyArray = [10, 500, -200, 50, 0, -100, 80, -150, 200, -100, -100, 5, -5, 120, 200, 500, 
30, -200, 100, -100, 200, 10, 400, 500, 100, 50, -10, -50, -200, 150, 50, 100, 150, -300, -40,
80, 120, 50, -60, 150, -30, 200, 100, 150, -50, 200]


function ColorsPicked(roomName, sock, color, money) {
  this.room = roomName;
  this.sock = sock;
  this.color = color;
  this.money = money;
}

function Player(roomName, id, userName, carColor) {
	this.roomName = roomName;
	this.id = id;
	this.userName = userName;
	this.carColor = carColor;
}


function nextTurn(room) {
  rooms[room].currentTurn = rooms[room].currentTurn + 1;
  rooms[room].currentTurn = rooms[room].currentTurn % rooms[room].players.length;
}


app.set('port', 5000);
app.set('views', './views');
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true}))


const rooms = {}

//renders our index page and passes it to all the rooms
app.get('/', (req, res) => {
	res.render('index', {rooms: rooms});
});

app.post('/room', (req, res) => {
	if (rooms[req.body.room] != null) {
		return res.redirect('/');
	}
	rooms[req.body.room] = {users: {}, players: [], colorChosen: [], selectOrder: [], currentTurn: 0}
	res.redirect(req.body.room);
	//Send message that new room was create
	io.emit('room-created', req.body.room)
})

app.get('/:room', (req, res) => {
	if (rooms[req.params.room] == null) {
		return res.redirect('/');
	}
	res.render('room', { roomName: req.params.room})
})

// In case server crashes
server.on('error', (err) => {
	console.error('Server error:', err);
});

// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

io.on('connection', socket => {
  socket.on('new-user', (room, name) => {
    socket.join(room)
    rooms[room].users[socket.id] = name

    var player = new Player(room, socket.id, name, null);
    rooms[room].players.push(player);

    socket.to(room).broadcast.emit('user-connected', player.userName)
  })
  socket.on('send-chat-message', (room, message) => {
    socket.to(room).broadcast.emit('chat-message', { message: message, name: rooms[room].users[socket.id] })
  })


  socket.on('choice-of-car', (room, id) => {
  	socket.to(room).broadcast.emit('car-chosen', id)
    var col = new ColorsPicked(room, socket.id, id, 0);

    rooms[room].colorChosen.push(col);

    if(rooms[room].colorChosen.length == rooms[room].players.length) {
      io.in(room).emit('activate-start', id);
    }
  })

   socket.on('ready-pressed', (room, signal) => {
    socket.to(room).broadcast.emit('everyone-ready', signal)
  })

   socket.on('start-pressed', (room, start) => {
    io.in(room).emit('game-begins', start)
  })

   socket.on('yes-cars', (room, message) => {
    for(var i=0; i<rooms[room].colorChosen.length; i++) {
      io.in(room).emit('all-cars', rooms[room].colorChosen[i].color);
      for(var f=0; f<rooms[room].players.length; f++) {
        if(rooms[room].players[f].id == rooms[room].colorChosen[i].sock) {
          io.in(room).emit('profile-usernames', rooms[room].players[f].userName);
        }
      }
      io.in(room).emit('profile-colors', rooms[room].colorChosen[i].color);
    }
    io.to(rooms[room].colorChosen[0].sock).emit('enable-button-0', message);
  })

  socket.on('rando-num', (room, num) => {
    io.in(room).emit('number', num)


    const previousTurn = rooms[room].currentTurn;
    if(rooms[room].colorChosen[previousTurn].color == 'red') {
      io.in(room).emit('red-num', num);
    } else if(rooms[room].colorChosen[previousTurn].color == 'green') {
      io.in(room).emit('green-num', num);
    } else if(rooms[room].colorChosen[previousTurn].color == 'blue') {
      io.in(room).emit('blue-num', num);
    } else if(rooms[room].colorChosen[previousTurn].color == 'purple') {
      io.in(room).emit('purple-num', num);
    }

    nextTurn(room);

    const turn = rooms[room].currentTurn;
    io.to(rooms[room].colorChosen[turn].sock).emit('enable-button', num);

  })


  socket.on('moneyb', (room, num) => {
    for(var b=0; b<rooms[room].colorChosen.length; b++){
      if(rooms[room].colorChosen[b].color == 'blue'){
        if(socket.id == rooms[room].colorChosen[b].sock){
          rooms[room].colorChosen[b].money += moneyArray[num];
          io.in(room).emit('blue-money-change', rooms[room].colorChosen[b].money);
        }
      }
    }
  })

  socket.on('moneyg', (room, num) => {
    for(var g=0; g<rooms[room].colorChosen.length; g++){
      if(rooms[room].colorChosen[g].color == 'green'){
        if(socket.id == rooms[room].colorChosen[g].sock){
          rooms[room].colorChosen[g].money += moneyArray[num];
          io.in(room).emit('green-money-change', rooms[room].colorChosen[g].money);
        }
      }
    }
  })

  socket.on('moneyp', (room, num) => {
    for(var p=0; p<rooms[room].colorChosen.length; p++){
      if(rooms[room].colorChosen[p].color == 'purple'){
        if(socket.id == rooms[room].colorChosen[p].sock){
          rooms[room].colorChosen[p].money += moneyArray[num];
          io.in(room).emit('purple-money-change', rooms[room].colorChosen[p].money);
        }
      }
    }
  })

  socket.on('moneyr', (room, num) => {
    for(var r=0; r<rooms[room].colorChosen.length; r++){
      if(rooms[room].colorChosen[r].color == 'red'){
        if(socket.id == rooms[room].colorChosen[r].sock){
          rooms[room].colorChosen[r].money += moneyArray[num];
          io.in(room).emit('red-money-change', rooms[room].colorChosen[r].money);
        }
      }
    }
  })


  socket.on('disconnect', () => {
    getUserRooms(socket).forEach(room => {
      socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id])
      delete rooms[room].users[socket.id]
    })
  })
})


function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name)
    return names
  }, [])
}
