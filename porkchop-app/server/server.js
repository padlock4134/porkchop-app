// server.server.js
const http = require('http');
const stoppable = require('stoppable');

// Have the Node/Express server serve up the Porkchop app.
const porkchopApp = require('./porkchop-app');

function getServerPort() {
  const value = process.env.PORT;
  const port = parseInt(value, 10);

  if (Number.isNaN(port)) {
    return value;
  }
  if (port >= 0) {
    return port;
  }

  return false;
}

const port = getServerPort();

porkchopApp.set('port', port);

const server = stoppable(http.createServer(porkchopApp));

server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      console.error(`Requires elevated privileges to run server!`);
      process.exit(1);
    case 'EADDRINUSE':
      console.error(`Port ${error.port} is already in use!`);
      process.exit(1);
    default:
      throw error;
  }
});

server.on('listening', () => {
  console.info(`Server is listening on ${port}`);
});

process.on('SIGINT', () => {
  server.stop();
  process.exit();
});
process.on('SIGTERM', () => {
  server.stop();
  process.exit();
});

server.listen(port);
