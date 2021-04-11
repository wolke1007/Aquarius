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

  // ========== chat logic start ==========
  $(document).ready(function () {
    console.log('document ready');
    $(msg).focus();
  }); // focus 在講話的輸入欄上

  window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    };
    switch (event.key) {
      case "Enter":
        console.log("enter been enter");
        $(send).click();
        document.getElementById('msg').value = '';
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }
  });

  socket.on('return chat history', function (chatHistoryOnServer) {
    console.log("update chatHistory");
    updateChat(chatHistoryOnServer);
  }); // 要求現有的對話紀錄(剛加入時使用)

  socket.on('update chatHistory', function (chatHistoryOnServer) {
    console.log("update chatHistory");
    updateChat(chatHistoryOnServer)
  }); // 有人講話就更新

  socket.on('clean chat', function (chatHistoryOnServer) {
    console.log("clean chat");
    updateChat(chatHistoryOnServer);
  });

  document.getElementById('send').addEventListener('click', function () {
    console.log("talk");
    socket.emit('someone talk', document.getElementById('msg').value);
    document.getElementById('msg').value = '';
  }) // 註冊 click event，當按下按鈕時送出聊天訊息

  document.getElementById('clean').addEventListener('click', function () {
    socket.emit('clean chat');
  }) // 清除大家的聊天紀錄

  socket.emit('request chat history'); // 跟伺服器要求現有的對話紀錄
  // ========== chat logic end ==========
};

function update() {

};

/**
 * 拿到伺服器上最新的聊天訊息，並更新 html 上的文字
 * @param {list} chatHistoryOnServer 
 * @returns 
 */
function updateChat(chatHistoryOnServer) {
  console.log("update chat~");
  console.log(chatHistoryOnServer);
  console.log(Object.keys(chatHistoryOnServer).length);
  let historyText = "";
  let historyDiv = document.getElementById('chatHistory');
  if (Object.keys(chatHistoryOnServer).length == 0) {
    historyDiv.innerHTML = "<tr></tr>"
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
  historyDiv.innerHTML = historyText;
  let tableElement = document.getElementById('chatHistory');
  tableElement.scrollTop = tableElement.scrollHeight;
}