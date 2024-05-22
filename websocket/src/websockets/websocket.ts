import { Server } from "http";
import { request, connection } from "websocket";

var WebSocketServer = require('websocket').server;

export enum WebsocketEvent {
  CONNECTION = 'connection',
  MESSAGE = 'message',
  CLOSE = 'close'
}

export const createWebSocketServer = async (server: Server) => {
  const wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
  });

  wsServer.on('request', function(request: request) {
    if (!originIsAllowed(request.origin) || !request.httpRequest.headers.authorization) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    const token = request.httpRequest.headers.authorization.split(' ')[1];
    const decodedToken = 

    const connection = request.accept('echo-protocol', request.origin);
    console.log(`${new Date()}: - ${request.} - Connection accepted.`);
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
  });

  wsServer.on(WebsocketEvent.CONNECTION, function (wsConnection: connection) {
    console.log(`Event: ${WebsocketEvent.CONNECTION}`);
    console.log(`${wsConnection.remoteAddress} connected.`);
    wsConnection.on(WebsocketEvent.MESSAGE, function (message) {
      console.log('Received Message: ' + message);
      // wsConnection.sendUTF(message.utf8Data);
    });
    wsConnection.on(WebsocketEvent.CLOSE, function (reasonCode, description) {
      console.log('Peer ' + wsConnection.remoteAddress + ' disconnected.');
    });
  
  })

  return wsServer
}

function originIsAllowed(origin: string) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}
