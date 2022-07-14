// connection.js
const { ClusterClosedError } = require('couchbase');
const couchbase = require('couchbase')

const url = process.env.DB_URL;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const CB = {
  endpoint: process.env.CB_ENDPOINT || '10.16.6.159',
  username: process.env.CB_USER || 'ewaiver_user',
  password: process.env.CB_PASS || 'ewaiver_user'
}

let bucket = '';
let cluster = '';
let defaultCollection = '';

module.exports.getCluster = getCluster;
module.exports.bucket = bucket;
module.exports.cluster = cluster;
module.exports.defaultCollection = defaultCollection;

async function getCluster() {

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

  try {
    const cluster = await couchbase.connect(`couchbase://${CB.endpoint}`, { username: CB.username, password: CB.password }, (err, cluster) => {
      console.log('GET CLUSTER');
      console.log("cluster: " + cluster);
      bucket = cluster.bucket('ewaiver');
      defautScope = bucket.scope('_default');
      defaultCollection = bucket.collection('_default');
      console.log('CLUSTER BUCKET:', bucket)
      console.log("Connected successfully")
    });
    return cluster;
  } catch (error) {
    console.log(error);
  }
}