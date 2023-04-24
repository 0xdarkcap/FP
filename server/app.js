const http = require('http');
const WebSocket = require('ws');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const clients = new Map();

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    
    switch (data.type) {
      case 'register':
        const username = data.username;
        if (!clients.has(username)) {
          clients.set(username, ws);
          ws.send(JSON.stringify({ type: 'registration', status: 'success', message: 'Registration successful' }));
        } else {
          ws.send(JSON.stringify({ type: 'registration', status: 'error', message: 'Username already taken' }));
        }
        break;
      
      case 'getUsers':
        ws.send(JSON.stringify({ type: 'userList', users: Array.from(clients.keys()) }));
        break;

      case 'dm':
        const receiver = clients.get(data.to);
        if (receiver) {
          receiver.send(JSON.stringify({ type: 'dm', from: data.from, message: data.message }));
        } else {
          ws.send(JSON.stringify({ type: 'error', message: 'User not found' }));
        }
        break;

      case 'groupchat':
        for (const [username, client] of clients.entries()) {
          if (client !== ws) {
            client.send(JSON.stringify({ type: 'groupchat', from: data.from, message: data.message }));
          }
        }
        break;

      default:
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid request type' }));
    }
  });

  ws.on('close', () => {
    for (const [username, client] of clients.entries()) {
      if (client === ws) {
        clients.delete(username);
        break;
      }
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
