var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);
function preload() { }

function create() {
  var socket = io();
  socket.on('newPlayer', function (players) {
    console.log("new player is join~");
    console.log(players);
  });

  socket.on('update chatHistory', function (chatHistory) {
    console.log("someone talking~");
    console.log(chatHistory);
  });
  // console.log("talk");
  // socket.emit('someone talk', 'Hello Socket.IO');
};

function update() {

};

