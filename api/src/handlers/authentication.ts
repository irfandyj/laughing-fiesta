import 'source-map-support/register';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda';
import { getMongoClient } from '../db/init';
import { UserDoc, UserDto } from '../models/user';
import { Entities } from '../lib/entitites';
import { generateJwtToken, hash } from '../lib/authentication';
import { UserSignUpDto } from '../models/authentication';


/**
 * Notes to self, The Sign Up Flow:
 * 1. [x] User input name, email, password
 * 2. [-] (Partial) We validate input, whether the property exist, character length, etc
 * 3. [x] Check if the user already exists
 * 4. [x] If not, we hash the password
 * 5. User join a default room (which is going to be created by a `Room` seed later)
 * 6. [x] We create the user
 * 7. [x] Create a JWT Token
 * 8. [x] Return the user and the token
 */

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
    // Hashing password
    const hashedPassword = await hash(body.password);
    const newUser = {
      name: body.name,
      email: body.email,
      password: hashedPassword,
      rooms: [],
      created_at: new Date(),
      updated_at: null
    }
    const result = await usersCollection.insertOne(newUser);

    const token = await generateJwtToken({
      sub: result.insertedId.toString(),
      name: newUser.name,
      email: newUser.email
    })
    const signUpResponse: UserSignUpDto = {
      id: result.insertedId.toString(),
      name: newUser.name,
      email: newUser.email,
      rooms: [],
      created_at: newUser.created_at,
      token: token
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
