const https = require('https');
var express = require('express');
var morgan = require('morgan');
var cors = require('cors');
const axios = require('axios');
const connection = require('./connection');

const url = process.env.DB_URL;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const CB = {
  endpoint: process.env.CB_ENDPOINT || '10.16.6.159',
  username: process.env.CB_USER || 'user',
  password: process.env.CB_PASS || 'password'
};
const mock = true;
const mockedResult = {
  value: {
    hits: [
      {
        id: "user1",
        fields: {
          FIRST_NAME: "Jhon2",
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
};

async function connect_2_couchbase() {
  try {
    console.log(` Trying to connect to backend Couchbase server..`)
    const con = await connection.getCluster();
    const data_bucket = con.bucket('ewaiver');
    const data_scope = data_bucket.scope('_default');
    const data_cluster = con.cluster;
    const data_collection = data_scope.collection('_defualt');
    console.log(data_cluster);
    console.log(data_collection);
  } catch (error) {
    console.log('ERROR: ', error);
  }
}

async function main() {
  console.log('Live search NodeJS API:')
  const collection = connect_2_couchbase();
  
  var app = express();
  app.use(morgan('dev'));
  app.use(cors());
  app.use(express.json());

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
      headers,
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

  app.post('/update', async (req, res) => {
    const body = req.body;
    const key = `${body.documentType}:${body.consumerId}`;
    const document = body.document;
    try {
      const searched = await collection.get(key);
      searched['LOYALTY_TIER'] = document.loyaltyTier;
      searched['LOYALTY_POINTS'] = document.loyaltyPoints;
      searched['CLOSE_TO_TIER'] = document.closeToTier;
      const result = await collection.insert(key, searched);
      console.log(result);
      return res.send(searched);
    } catch (error) {
      console.log('Could not insert document to collection.');
      console.log('ERROR:', error);
    }
  });

  app.post('/user-detail', async (req, res) => {
    const body = req.body;
    console.log(body);
    console.log(body.id);
    let result = {};
    if(mock === true) {
      result = mockedResult;
    } else {
      try {
        // result = await collection.get(body.id);
        result = await collection.get('ARG_CONS_DATA:172382');
      } catch (error) {
        console.log('Could not get document in collection.');
        console.log('ERROR:', error);
      }
      
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