const http = require('http');
var couchbase = require('couchbase');
var express = require('express');
var morgan = require('morgan');
var cors = require('cors');
var swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const index_page = `<h1>Live Search API</h1>
A sample API for getting started with Couchbase Server and the Node.js SDK.`;

mockedResult = {
  value: {
    hits: [
      {
        id: "user1",
        fields: {
          FIRST_NAME: "Jhon",
          LAST_NAME: "Smith",
          EMAIL_ADDRESS: "jhon.smith@test.com",
          CNSMR_HOME_PHONE_NBR: "310123456",
          CNSMR_ID: "123",
          CNSMR_GENDER_CODE: "1",
          CNSMR_PREFIX_CODE: "3",
          CNSMR_MIDDLE_NAME: "Smith",
          CNSMR_ADDRESS_NAME: "Street 1",
          CNSMR_ADDRESS_CITY_NAME: "NY",
          CNSMR_ADDRESS_LINE1: "",
          CNSMR_EMAIL_TYPE_CODE: "",
          CNSMR_PHONE_ID: "12",
          CNSMR_PHONE_NBR: "123564"
        }
      },
      {
        id: "user2",
        fields: {
          FIRST_NAME: "Andrew",
          LAST_NAME: "Smith",
          EMAIL_ADDRESS: "andrew.smith@test.com",
          CNSMR_HOME_PHONE_NBR: "310123457",
          CNSMR_ID: "124",
          CNSMR_GENDER_CODE: "2",
          CNSMR_PREFIX_CODE: "3",
          CNSMR_MIDDLE_NAME: "",
          CNSMR_ADDRESS_NAME: "Street 48",
          CNSMR_ADDRESS_CITY_NAME: "NY",
          CNSMR_ADDRESS_LINE1: "Av.",
          CNSMR_EMAIL_TYPE_CODE: "rt",
          CNSMR_PHONE_ID: "13",
          CNSMR_PHONE_NBR: "25234"
        }
      }
    ],
    total_hits: 2
  }
}

const CB = {
  endpoint: process.env.CB_ENDPOINT || 'db',
  username: process.env.CB_USER || 'Administrator',
  password: process.env.CB_PASS || 'password'
}
const bucketName = 'ff4jProperties';
const scopeName = '';
const collectionName = '';
const mock = true;

async function connect_2_couchbase() {
  try {
    console.log(` Trying to connect to backend Couchbase server ${CB.host}...`)
    var cluster = await couchbase.connect(
      `couchbases://cb.${CB.endpoint}.cloud.couchbase.com`,
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
    mock = false;
    console.log('  Bucket succesfully opened.');
    return bucket.scope(scopeName).collection(collectionName)
  } catch (error) {
    console.log('ERROR: '. error);
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
    const body = req.body;
    console.log(body);
    console.log(body.id);
    let result = {};
    if(mock === true) {
      result = mockedResult;
    } else {
      result = await collection.get(body.id);
    }
    document = result.value;
    console.log(document);
    return res.send(document);
  });

  app.listen(8091, () => {
    console.log(' Listening on port 8091!');
  });
}

main()