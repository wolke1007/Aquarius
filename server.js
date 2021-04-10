var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var players = {};
var chatHistory = [];
 
app.use(express.static(__dirname + '/public'));
 
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index_aqua.html');
});

io.on('connection', function (socket) {
  console.log('a user connected');
  console.log('socket.id:'+socket.id);
  // create a new player and add it to our players object
  mainLogic(socket);
});

function mainLogic(socket){
  players[socket.id] = {
    playerId: socket.id
  };
  // send the players object to the new player
  socket.emit('currentPlayers', players);
  // update all other players of the new player
  socket.broadcast.emit('newPlayer', players[socket.id]);
 
  // when a player disconnects, remove them from our players object
  socket.on('disconnect', function () {
    console.log('a user disconnected');
    console.log('socket.id:'+socket.id);
    // remove this player from our players object
    delete players[socket.id];
    // emit a message to all players to remove this player
    io.emit('user disconnected', socket.id);
  });

  // ========== chat logic start ==========
  socket.on('request chat history', function () {
    socket.emit('return chat history', chatHistory);
  });

  socket.on('someone talk', function (text) {
    singleChat = { 'userId': socket.id, 'msg': text };
    chatHistory.push(singleChat)
    io.emit('update chatHistory', chatHistory);
  });

  socket.on('clean chat', function () {
    chatHistory = [];
    io.emit('clean chat', chatHistory);
  });
  // ========== chat logic end ==========
};


server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`);
});
