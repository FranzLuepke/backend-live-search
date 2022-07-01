// Couchbase authentication
const clusterConnStr = 'couchbases://cb.<your-endpoint>.cloud.couchbase.com'
const username = 'Administrator'
const password = 'Password123!'
const bucketName = 'travel-sample'
const scopeName = 'tenant_agent_00'
const collectionName = 'users'

var start = async function(a, b) {
  const cluster = await couchbase.connect(clusterConnStr, {
    username: username,
    password: password,
    timeouts: {
      kvTimeout: 10000,
    },
  });

  const bucket = cluster.bucket(bucketName);
  const collection = bucket.scope(scopeName).collection(collectionName);
}

const user = {
  firstName: 'Will',
  lastName: 'Smith',
  email: 'will.smith@test.com',
  phone: '12345678',
  consumerId: '10',
}

const getUser = () => {
  return user;
};

exports.getUser = getUser;