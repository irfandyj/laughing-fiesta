import 'source-map-support/register';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda';
import { getMongoClient } from '../db/init';
import { GetResponse } from '../lib/response';
import { User } from '../models/user';
import { Document, Filter } from 'mongodb';

const CLIENT_HOST = "http://localhost:3000"

interface Query {
  limit: number;
  page: number;
  sortBy: [string, 'ASC' | 'DESC'];
  filter: Filter<UserDoc>;
}

interface QueryDto<T> {
  limit?: string;
  page?: string;
  sortBy?: string[];
  filter?: string;
}

interface UserDoc extends Document {
  id: string;
  name: string;
  email: string;
}

/**
 * A simple example includes a HTTP get method.
 */
export const getUsersHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  // All log statements are written to CloudWatch
  console.debug('Received event:', event);

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

    // Are there any queries
    const qs = event.queryStringParameters;
    const query: Query = {
      limit: 10,
      page: 1,
      sortBy: ['name', 'ASC'],
      filter: {}
    }
    if (qs) {
      query.limit = qs.limit ? parseInt(qs.limit) : 10;
      query.page = qs.page ? parseInt(qs.page) : 1;

      // Sort by name or email
      // Configure this later
      // query.sortBy = qs.sortBy ? qs.sortBy : ['name', 'ASC']

      // Filter where name or email contains the query string
      query.filter = qs.filter ? {
        $or: [
          { name: { $regex: qs.filter, $options: 'i' } },
          { email: { $regex: qs.filter, $options: 'i' } }
        ]
      } : {}
    }

    // Get the users collection
    const usersCollection = db.collection<UserDoc>('users');

    // Get all users
    const users = await usersCollection.find<UserDoc>(query.filter, {
      limit: query.limit,
      skip: (query.page - 1) * query.limit,
      sort: {
        [query.sortBy[0]]: query.sortBy[1] === 'ASC' ? 1 : -1
      }
    }).toArray();

    const totalDocuments = await usersCollection.countDocuments(query.filter);
    const totalPages = Math.ceil(totalDocuments / query.limit);
    const usersResponse: GetResponse<User> = {
      data: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email
      })),
      meta: {
        totalItems: totalDocuments,
        currentPage: query.page,
        totalPages: totalPages,
        sortBy: [['name', 'ASC']],
        limit: query.limit,
      },
      links: {
        first: `${CLIENT_HOST}/users?limit=${query.limit}&page=1`,
        previous: query.page > 1 ? `${CLIENT_HOST}/users?limit=${query.limit}&page=${query.page - 1}` : '',
        current: `${CLIENT_HOST}/users?limit=${query.limit}&page=${query.page}`,
        next: query.page < totalPages ? `${CLIENT_HOST}/users?limit=${query.limit}&page=${query.page + 1}` : '',
        last: `${CLIENT_HOST}/users?limit=${query.limit}&page=${totalPages}`,
      }
    }
    
    await closeConnection();
    return {
      statusCode: 200,
      body: JSON.stringify(usersResponse)
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
    const user: User = {
      name: requestBody?.name,
      email: requestBody?.email
    }
    const result = await usersCollection.insertOne(user);
    const userBodyResponse: User = {
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