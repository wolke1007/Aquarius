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

  socket.on('update chatHistory', function (chatHistoryOnServer){
    console.log("update chatHistory");
    updateChat(chatHistoryOnServer)
  });

  socket.on('clean chat', function (chatHistoryOnServer){
    console.log("clean chat");
    updateChat(chatHistoryOnServer)
  });

  document.getElementById('send').addEventListener('click', function () {
    console.log("talk");
    socket.emit('someone talk', document.getElementById('msg').value);
  })

  document.getElementById('clean').addEventListener('click', function () {
    socket.emit('clean chat');
  })
};

function update() {

};

function updateChat(chatHistoryOnServer) {
  console.log("update chat~");
  console.log(chatHistoryOnServer);
  console.log(Object.keys(chatHistoryOnServer).length);
  let historyText = "";
  if ( Object.keys(chatHistoryOnServer).length == 0 ){
    document.getElementById('chatHistory').innerHTML = "<tr></tr>"
    return;
  }
  chatHistoryOnServer.forEach(function (element) {
    historyText += "<tr>"
    historyText += "<td>"
    historyText += ("User: " + element.userId); //user
    historyText += "</td>"
    historyText += "<td>"
    historyText += (element.msg); //message
    historyText += "</td>"
    historyText += "</tr>"
  });
  document.getElementById('chatHistory').innerHTML = historyText;
}