import { client } from "websocket";

async function connectToCurrentWebsocket () {
  const ws = new client();
  ws.connect('ws://localhost:8080', 'echo-protocol');
  ws.on('connect', function(connection) {
    console.log('Connected');
    connection.on('message', function(message) {
      if (message.type === 'utf8') {
        console.log('Received Message: ' + message.utf8Data);
      }
    });
  });
}

connectToCurrentWebsocket();