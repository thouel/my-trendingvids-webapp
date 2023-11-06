const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config({ path: '.env.local' });

async function createIndex() {
  console.log('Index creation --- START');
  try {
    console.log('1');
    const client = new MongoClient(process.env.MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    console.log('2');
    client.connect().then(async () => {
      console.log('3');
      const collection = client.db().collection('VerificationToken');
      collection.createIndex({ identifier: 1, token: 1 }).then(async (res) => {
        console.log('4');
        await client.close();
        console.log('VerificationToken index created:', { res });
      });
    });
  } catch (e) {
    console.log('Index creation ERROR', { e });
    return 1;
  }
  console.log('Index creation --- END');
  return 0;
}

var res = 1;
(async () => {
  res = await createIndex();
})().then(process.exit(res));
