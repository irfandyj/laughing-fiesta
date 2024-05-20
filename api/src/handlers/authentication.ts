import 'source-map-support/register';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda';
import { getMongoClient } from '../db/init';
import { UserDoc } from 'gigradar-commons/build/dtos/user';
import { Entities } from '../lib/entitites';
import { compare, generateJwtToken, hash } from '../lib/authentication';
import { SignInDto, UserAuthenticationDto } from 'gigradar-commons/build/dtos/authentication';
// import { Endpoints } from 'gigradar-commons/build/constants/endpoints';

enum Endpoints {
  SIGN_UP = 'signup',
  SIGN_IN = 'signin'
}

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
 * 9. [ ] Idk where to put this yet, but user should be allowed to join websocket after this
 */

/**
 * A simple example includes a HTTP get method.
 */
export async function signUpHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  // All log statements are written to CloudWatch
  console.debug('Received event:', event);
  if (event.body === null) {
    console.log(`400 - POST /${Endpoints.SIGN_UP} - Body is null`)
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Bad Request' })
    };
  }

  // Validates body
  const body = JSON.parse(event.body);

  /** Checklist based on SignUpDto */
  if (!body.name || !body.email || !body.password) {
    console.log(`400 - POST /${Endpoints.SIGN_UP} - Missing required fields`)
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Bad Request' })
    };
  }

  try {
    const mongoClient = await getMongoClient();
    if (!mongoClient || !mongoClient.db || !mongoClient.closeConnection) {
      console.log(`500 - GET /${Endpoints.SIGN_UP} - Error connecting to DB`)
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
      console.log(`409 - POST /${Endpoints.SIGN_UP} - User already exists`)
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
    const signUpResponse: UserAuthenticationDto = {
      id: result.insertedId.toString(),
      name: newUser.name,
      email: newUser.email,
      rooms: [],
      created_at: newUser.created_at,
      token: token
    }

    console.log(`200 - POST ${Endpoints.SIGN_UP} - Sign up successful`)
    await closeConnection();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Custom-Header": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:8000",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
        "Access-Control-Allow-Credentials": "true"
      },
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

export async function signInHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  // All log statements are written to CloudWatch
  console.debug('Received event:', event);
  if (event.body === null) {
    console.log(`400 - POST ${Endpoints.SIGN_IN} - Body is null`)
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Bad Request' })
    };
  }

  // Validates body
  const body = JSON.parse(event.body);

  /** Checklist based on SignInDto */
  if (!body.email || !body.password) {
    console.log(`400 - POST ${Endpoints.SIGN_IN} - Missing required fields`)
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Bad Request' })
    };
  }

  const userSignInData: SignInDto = {
    email: body.email,
    password: body.password
  }

  try {
    const mongoClient = await getMongoClient();
    if (!mongoClient || !mongoClient.db || !mongoClient.closeConnection) {
      console.log(`500 - GET ${Endpoints.SIGN_IN} - Error connecting to DB`)
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal Server Error' })
      };
    }
    const { db, closeConnection } = mongoClient;

    // Get the users collection
    const usersCollection = db.collection<UserDoc>(Entities.USERS);
    const foundUser = await usersCollection.findOne({ email: userSignInData.email });
    if (!foundUser) {
      console.log(`404 - POST ${Endpoints.SIGN_IN} - User not found`)
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Not Found' })
      };
    }

    // Check password
    const isPasswordMatch = await compare(userSignInData.password, foundUser.password);
    if (!isPasswordMatch) {
      console.log(`401 - POST ${Endpoints.SIGN_IN} - Password not match`)
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Unauthorized' })
      };
    }

    const token = await generateJwtToken({
      sub: foundUser._id.toString(),
      name: foundUser.name,
      email: foundUser.email
    })
    const signInResponse: UserAuthenticationDto = {
      id: foundUser._id.toString(),
      name: foundUser.name,
      email: foundUser.email,
      rooms: foundUser.rooms,
      created_at: foundUser.created_at,
      token: token
    }

    console.log(`200 - POST ${Endpoints.SIGN_IN} - ${foundUser.email} signed in`)
    await closeConnection();
    return {
      statusCode: 200,
      body: JSON.stringify(signInResponse)
    };
  }
  catch (e) {
    console.log(JSON.stringify(e))
    console.error(e)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' })
    };
  }
}