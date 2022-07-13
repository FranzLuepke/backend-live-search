const https = require('https');
var couchbase = require('couchbase');
var express = require('express');
var morgan = require('morgan');
var cors = require('cors');
var swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const axios = require('axios');

const url = process.env.DB_URL;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

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

  if (!url) {
    console.log("Please define the endpoint URL in enviroment variable name DB_URL.");
    process.exit();
  } else {
    console.log("  Working with endpoint URL:", url);
  }
  if (!user) {
    console.log("Please define the username in enviroment variable name DB_USER.");
    process.exit();
  }
  if (!password) {
    console.log("Please define the endpoint pasword in enviroment variable name DB_PASSWORD.");
    process.exit();
  }

  app.post('/live-search', async (req, res) => {
    const reqBody = req.body;
    console.log(reqBody);
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(`${user}:${password}`)
    };
    const body = {
      "query" : {
        "field": reqBody.field,
        "prefix": reqBody.value
      },
      "size": 10,
      "from": 0,
      "fields" : ["*"],
      "explain": false,
      "highlight": {}
    };
    return axios.post(
      url,
      { "body": body },
      {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`user:password`)
      },
    }).then(axRes => {
      console.log(`statusCode: ${res.status}`);
      return res.send(axRes.data);
    })
    .catch(error => {
      console.error(error);
      return res.send(error);
    });
  });


  app.post('/manual-search', async (req, res) => {
    const reqBody = req.body;
    console.log(reqBody);
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(`user:password`)
    };
    const body = {
      "query" : {
        "conjuncts": reqBody.fields,
      },
      "size": 10,
      "from": 0,
      "fields" : ["*"],
      "explain": false,
      "highlight": {}
    };
    console.log(body);
    return axios.post(
      "https://livesearchapi.azure-api.net/api/index/intranet_persistence/query/detail",
      { "body": body },
      {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`user:password`)
      },
    }).then(axRes => {
      console.log(`statusCode: ${res.status}`);
      return res.send(axRes.data);
    })
    .catch(error => {
      console.error(error);
      return res.send(error);
    });
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