const http = require('http');
var couchbase = require('couchbase')

const hostname = '127.0.0.1';
const port = 3000;

// Couchbase authentication
const clusterConnStr = 'couchbases://cb.<your-endpoint>.cloud.couchbase.com'
const username = 'Administrator'
const password = 'Password123!'
const bucketName = 'travel-sample'
const scopeName = 'tenant_agent_00'
const collectionName = 'users'

const cluster = await couchbase.connect(clusterConnStr, {
  username: username,
  password: password,
  timeouts: {
    kvTimeout: 10000, // milliseconds
  },
});

const bucket = cluster.bucket(bucketName);
const collection = bucket.scope(scopeName).collection(collectionName);

const user = {
  firstName: 'Will',
  lastName: 'Smith',
  email: 'will.smith@test.com',
  phone: '12345678',
  consumerId: '10',
}

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server is been executed in http://${hostname}:${port}/`);
});

async function main() {
  
}


