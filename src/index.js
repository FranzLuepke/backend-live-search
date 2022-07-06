const http = require('http');
var couchbase = require('couchbase');
var express = require('express');
var morgan = require('morgan');
var cors = require('cors');
var swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const index_page = `<h1>Live Search API</h1>
A sample API for getting started with Couchbase Server and the Node.js SDK.`;

const CB = {
  host: process.env.CB_HOST || 'db',
  username: process.env.CB_USER || 'Administrator',
  password: process.env.CB_PASS || 'password'
}
const bucketName = 'ff4jProperties';
const scopeName = '';
const collectionName = '';

function web_server() {
  const hostname = '127.0.0.1';
  const port = 3000;
  const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
  });
  server.listen(port, hostname, () => {
    console.log(`Server is been executed in http://${hostname}:${port}/`);
  });
}

async function connect_2_couchbase() {
  try {
    console.log(` Trying to connect to backend Couchbase server ${CB.host}...`)
    var cluster = await couchbase.connect(
      `couchbase://${CB.host}`,
      {
        username: CB.username,
        password: CB.password,
        timeouts: {
          kvTimeout: 10000,
        },
      }
    );
    console.log('  Connected succesfully to Couchbase host!');
    console.log(' Openning bucket...');
    var bucket = cluster.bucket(bucketName);
    console.log('  Bucket succesfully opened.');
    return bucket.scope(scopeName).collection(collectionName)
  } catch (error) {
    console.log('  Could not connect to couchbase. Check your credentials or bucket name.');
  }
}

async function main() {
  console.log('Live search NodeJS API:')
  const collection = connect_2_couchbase();
  var app = express();
  app.use(morgan('dev'));
  app.use(cors());
  app.use(express.json());

  app.use('/live', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.get('/', (req, res) => {
    return res.send(index_page);
  });

  app.post('/user-detail', async (req, res) => {
    const key = req.body;
    const result = await collection.get(key);
    document = result.value;
    console.log(document);
    return res.send(value.hits);
  });

  app.listen(8080, () => {
    console.log(' Listening on port 8080!');
  });
}

main()