const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config({ path: '.env.local' });

async function dropDatabase() {
  console.log('Drop database --- START');
  try {
    const client = new MongoClient(process.env.MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    await client.connect();

    const res = client.db().dropDatabase();

    await client.close();

    console.log('Database dropped:', { res });
  } catch (e) {
    console.log('Drop database ERROR', { e });
    return 1;
  }
  console.log('Drop database --- END');
  return 0;
}

var res = 1;
(async () => {
  res = await dropDatabase();
})();

process.exit(res);
