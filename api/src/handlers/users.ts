import 'source-map-support/register';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda';
import { getMongoClient } from '../db/init';
import { GetResponse } from '../lib/response';
import { UserEntity } from '../models/user';

const HOST = "http://localhost:3000"

/**
 * A simple example includes a HTTP get method.
 */
export const getUsersHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  // All log statements are written to CloudWatch
  console.debug('Received event:', event);

  const usersResponse: GetResponse<UserEntity> = {
    data: [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@fakemail.com'
      },
      {
        id: '2',
        name: 'Jane Doe',
        email: 'jane.doe@fakemail.com'
      }
    ],
    meta: {
      totalItems: 2,
      currentPage: 1,
      totalPages: 1,
      sortBy: [['name', 'ASC']],
      limit: 10,
    },
    links: {
      first: `${HOST}/users?limit=10&page=1`,
      previous: ``,
      current: `${HOST}/users?limit=10&page=1`,
      next: ``,
      last: `${HOST}/users?limit=10&page=1`,
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(usersResponse)
  };
}

interface UserPostBodyRequest {
  name: string;
  email: string;
}

export async function postUserHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  // All log statements are written to CloudWatch
  console.debug('Received event:', event);
  if (event.body === null) {
    console.log("400 - POST /users - Body is null")
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Bad Request' })
    };
  }

  // Validates body
  const requestBody = JSON.parse(event.body) as UserPostBodyRequest;
  if (typeof requestBody.name !== 'string' || typeof requestBody.email !== 'string') {
    console.log("400 - POST /users - Body is not valid")
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Bad Request' })
    };
  }

  try {
    const mongoClient = await getMongoClient();
    if (!mongoClient || !mongoClient.db || !mongoClient.closeConnection) {
      console.log("500 - POST /users - Error connecting to DB")
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal Server Error' })
      };
    }
    const { db, closeConnection } = mongoClient;
    console.log("Connection to DB established")

    const usersCollection = db.collection('users');
    const user: UserEntity = {
      name: requestBody?.name,
      email: requestBody?.email
    }
    const result = await usersCollection.insertOne(user);
    const userBodyResponse: UserEntity = {
      id: result.insertedId.toString(),
      name: requestBody.name,
      email: requestBody.email
    }
    await closeConnection();
    return {
      statusCode: 200,
      body: JSON.stringify(userBodyResponse)
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