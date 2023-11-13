const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!',
    );

    // Create the Index
    const result = await client.db().dropDatabase();
    console.log('Database dropped', { result });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
  return 0;
}

(async () => {
  const res = await run().catch((e) => {
    console.dir(e);
    return 1;
  });
  console.log('res', { res });
  process.exit(res);
})();
