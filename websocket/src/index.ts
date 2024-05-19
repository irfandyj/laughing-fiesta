import { createServer } from './server';
import { createWebSocketServer } from './websocket';

async function main() {
  try {
    console.log("Initiating server...");
    const server = await createServer();
    console.log("Initiating websocket server...");
    const ws = await createWebSocketServer(server);
  } catch (e) {
    console.error(e);
  }
}

main();