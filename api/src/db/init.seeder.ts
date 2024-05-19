/**
 * This file is used to seed the database with initial data
 */

/**
 * This file is used to empty the database.
 */

import { ObjectId } from 'mongodb';
import { Entities } from '../lib/entitites';
import { getMongoClient } from './init';

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

    const roomsCollection = db.collection(Entities.ROOMS);
    await roomsCollection.insertOne({
      name: 'Default Room',
      description: 'This is the default room',
      users: [],
      messages: [],
      created_at: new Date(),
      updated_at: null
    })
    console.log("Successfully inserted default room")

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