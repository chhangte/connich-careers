const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

async function checkDatabases() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    
    for (const dbName of ['careers', 'careers-kidsden']) {
      console.log(`\n--- Database: ${dbName} ---`);
      const db = client.db(dbName);
      const collections = await db.listCollections().toArray();
      
      for (const coll of collections) {
        const count = await db.collection(coll.name).countDocuments();
        console.log(`Collection: ${coll.name} - ${count} documents`);
        
        if (coll.name === 'users' && count > 0) {
          const users = await db.collection(coll.name).find({}).toArray();
          users.forEach(u => console.log(`  User: ${u.email} | Name: ${u.name} | Role: ${u.role}`));
        }
      }
    }

  } catch (e) {
    console.error("Error checking databases:", e);
  } finally {
    await client.close();
  }
}

checkDatabases();
