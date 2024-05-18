import { MongoClient } from "mongodb";

/**
 * Database Credentials
 * Had to be const here cuz I don't know how to combine `docker-compose` with
 * SAM yet!
 */
const DB_NAME = 'chat-app';
// const DB_HOST = 'localhost';
// const DB_HOST = '127.0.0.1';
// const DB_HOST = 'host.docker.internal';
// const DB_HOST = '172.17.0.2';
const DB_HOST = '172.26.0.2'; // Works! with sam local start-api --docker-network infra_default
const DB_PORT = '27017';
const DB_USERNAME = 'root';
const DB_PASSWORD = 'example';

// Connection URL

// Working commands 
const CONNECTION_URL = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`;
const mongoClient = new MongoClient(CONNECTION_URL);


export async function getMongoClient () {
  try {
    await mongoClient.connect();
    const db = mongoClient.db(DB_NAME);
    console.log('Connected successfully to server');
    return {
      db,
      closeConnection: async () => await mongoClient.close()
    };
  } catch (e) {
    console.log('Error connecting to server')
    console.error(e)
    console.log(JSON.stringify(e))
    console.log("------ End of error ------")
  }
} 

/**
 * Reference from https://www.npmjs.com/package/mongodb
 * if you don't use serverless this is the common flow by the docs
 */
// async function main() {
//   // Use connect method to connect to the server
//   try {
//     const { db, close } = await getMongoClient();
//     console.log('Connected successfully to server');
//     const collection = db.collection('documents');
  
//     // the following code examples can be pasted here...
  
//     return 'done.';
//   } catch (e) {
//     console.error(e)
//   }
// }

// main()
//   .then(console.log)
//   .catch(console.error)
//   .finally(() => mongoClient.close());
