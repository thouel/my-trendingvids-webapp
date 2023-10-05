import { MongoClient, ServerApiVersion } from 'mongodb';
import { createRouter } from 'next-connect';

// const router = createRouter();

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_SECRET}@cluster0.zk7alxr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function getDatabase(req, res, next) {
  try {
    req.dbClient = client.db('trendingvids');
  } catch (e) {
    throw e;
  } finally {
    return next();
  }
}

async function closeDatabase(req, res, next) {
  /* try {
    console.log('4');
    console.dir('next', next);
    await client?.close();
  } catch (e) {
    throw e;
  } finally {
    next();
  } */
}
export { getDatabase, closeDatabase };
