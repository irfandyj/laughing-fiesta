import 'source-map-support/register';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda';
import { getMongoClient } from '../db/init';
import { UserDoc, UserDto } from '../models/user';
import { Entities } from '../lib/entitites';

/**
 * A simple example includes a HTTP get method.
 */
export const signUpHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  // All log statements are written to CloudWatch
  console.debug('Received event:', event);
  if (event.body === null) {
    console.log("400 - POST /rooms - Body is null")
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Bad Request' })
    };
  }

  // Validates body
  const body = JSON.parse(event.body);

  /** Checklist based on SignUpDto */
  if (!body.name || !body.email || !body.password) {
    console.log("400 - POST /users - Missing required fields")
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Bad Request' })
    };
  }

  try {
    const mongoClient = await getMongoClient();
    if (!mongoClient || !mongoClient.db || !mongoClient.closeConnection) {
      console.log("500 - GET /users - Error connecting to DB")
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal Server Error' })
      };
    }
    const { db, closeConnection } = mongoClient;

    // Get the users collection
    const usersCollection = db.collection<UserDoc>(Entities.USERS);
    const foundUser = await usersCollection.findOne({ email: body.email });
    if (foundUser) {
      console.log("409 - POST /users - User already exists")
      return {
        statusCode: 409,
        body: JSON.stringify({ message: 'Conflict' })
      };
    }

    // Create the user
    const newUser = {
      name: body.name,
      email: body.email,
      password: body.password,
      rooms: [],
      created_at: new Date(),
      updated_at: null
    }
    const result = await usersCollection.insertOne(newUser);

    const signUpResponse: UserDto = {
      id: result.insertedId.toHexString(),
      name: newUser.name,
      email: newUser.email,
      rooms: [],
      created_at: newUser.created_at
    }
    
    await closeConnection();
    return {
      statusCode: 200,
      body: JSON.stringify(signUpResponse)
    };
  } catch (e) {
    console.log(JSON.stringify(e))
    console.error(e)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' })
    };
  }
}
