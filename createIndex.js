const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config({ path: '.env.local' });

async function createIndex() {
  console.log('Index creation --- START');
  try {
    const client = new MongoClient(process.env.MONGODB_URL, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    await client.connect();

    const collection = client.db().collection('VerificationToken');
    const res = await collection.createIndex({ identifier: 1, token: 1 });

    await client.close();

    console.log('VerificationToken index created:', { res });
  } catch (e) {
    console.error('Index creation ERROR', { e });
    return 1;
  }
  console.log('Index creation --- END');
  return 0;
}

createIndex();
process.exit(0);
