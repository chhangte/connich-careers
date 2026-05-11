const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

async function listDatabases() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const adminDb = client.db().admin();
    const result = await adminDb.listDatabases();
    
    console.log("Databases on this cluster:");
    result.databases.forEach(db => console.log(` - ${db.name}`));

  } catch (e) {
    console.error("Error listing databases:", e);
  } finally {
    await client.close();
  }
}

listDatabases();
