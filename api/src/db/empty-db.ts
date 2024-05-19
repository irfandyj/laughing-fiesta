/**
 * This file is used to empty the database.
 */

import { Entities } from '../lib/entitites';
import { getMongoClient } from './init';

const entities = [
  Entities.ROOMS,
  Entities.USERS,
  Entities.MESSAGES,
]

/**
 * 
 * @returns 
 */
async function main() {
  // Use connect method to connect to the server
  try {
    const mongoClient = await getMongoClient();
    if (!mongoClient || !mongoClient.db || !mongoClient.closeConnection) {
      throw new Error('Connection failed');
    }
    console.log('Connected successfully to server');
    const { db, closeConnection } = mongoClient;

    for (let i = 0; i < entities.length; i++) {
      const collection = db.collection(entities[i]);
      await collection.deleteMany({});
      console.log(`Deleted all documents in ${entities[i]}`);
    }
    console.log('Deletion complete.');
    closeConnection();
    return;
  } catch (e) {
    console.error(e)
  }
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => process.exit(0));