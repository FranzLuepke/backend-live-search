const http = require('http');
var couchbase = require('couchbase')
const cb = require('./cb');

const hostname = '127.0.0.1';
const port = 3000;

console.log(`User: ${ cb.getUser().firstName}`);

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server is been executed in http://${hostname}:${port}/`);
});
