import * as http from 'http';

const PORT = 8080;

async function createServer() {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
  });

  server.listen(PORT, () => {
    console.log('Server running at http://localhost:' + PORT);
  })

  return server
}

export { createServer }