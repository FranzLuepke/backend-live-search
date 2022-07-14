var express = require('express');
var morgan = require('morgan');
var cors = require('cors');

const couchbase = require('couchbase')
async function main() {
  // For a secure cluster connection, use `couchbases://<your-cluster-ip>` instead.
  const clusterConnStr = 'couchbase://10.16.6.159'
  const username = 'argo_search'
  const password = 'argo_search0'
  const bucketName = 'ff4jProperties'
  const cluster = await couchbase.connect(clusterConnStr, {
    username: 'argo_search',
    password: 'argo_search0',
    // Uncomment if you require a secure cluster connection (TSL/SSL).
    // This is strongly recommended for production use.
    // security: {
    //   trustStorePath: certificate,
    // },
  })
  const bucket = cluster.bucket(bucketName)
  // Get a reference to the default collection, required only for older Couchbase server versions
  const collection_default = bucket.defaultCollection()
  const collection = bucket.scope('_default').collection('_default')
  // Load the Document and print it
  // Prints Content and Metadata of the stored Document
  //const getResult = await collection.get('ARG_CONS_DATA:210636261')
  //console.log('Get Result: ', getResult)
  
  var app = express();
  app.use(morgan('dev'));
  app.use(cors());
  app.use(express.json());

  app.post('/user-detail', async (req, res) => {
    const body = req.body;
    console.log(body);
    console.log(body.id);
    const getResult = await collection.get('ARG_CONS_DATA:172382');
    console.log('Get Result: ', getResult);
    return res.send(getResult);
  });

  app.listen(8088, () => {
    console.log(' Listening on port 8088!');
  });
}
main()

