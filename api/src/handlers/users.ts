import 'source-map-support/register';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda';
import { getMongoClient } from '../db/init';
import { GetResponse } from '../lib/response';
import { IndexUserDto, UserDoc, UserDto } from '@gigradar/commons/build/dtos/user';
import { SORT_ORDER, SortQuery } from '../lib/request';
import { Entities } from '../lib/entitites';
import { JwtPayload, jwtAuthenticationMiddleware } from '../lib/authentication';

const CLIENT_HOST = "http://localhost:3000"

/**
 * A simple example includes a HTTP get method.
 */
export const getUsersHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  // All log statements are written to CloudWatch
  console.debug('Received event:', event);

  // Authenticate using JWT in `Authorization` header
  const jwtAuthResult = await jwtAuthenticationMiddleware(event);
  const isNotJwtPayload = !(jwtAuthResult instanceof JwtPayload);
  if (isNotJwtPayload) return jwtAuthResult as APIGatewayProxyResult;

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
    const query: IndexUserDto = {
      limit: 10,
      page: 1,
      sortBy: ['created_at', SORT_ORDER.DESC],
      filter: {}
    }
    if (qs) {
      query.limit = qs.limit ? parseInt(qs.limit) : 10;
      query.page = qs.page ? parseInt(qs.page) : 1;

      // Allowed sorts should be username, email, created_at
      if (qs.sortBy) {
        const sortBy = qs.sortBy.split(",");
        if (sortBy.length !== 2) {
          console.log("400 - GET /rooms - sortBy query is invalid")
          return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Bad Request' })
          };
        }
        query.sortBy = sortBy as SortQuery;
      }

      // Filter where username or email contains the query string
      query.filter = qs.filter ? {
        $or: [
          { username: { $regex: qs.filter, $options: 'i' } },
          { email: { $regex: qs.filter, $options: 'i' } }
        ]
      } : {}
    }

    // Get the users collection
    const usersCollection = db.collection<UserDoc>(Entities.USERS);

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
    const usersResponse: GetResponse<UserDto> = {
      data: users.map(user => ({
        id: user._id,
        username: user.username,
        email: user.email,
        rooms: user.rooms,
        created_at: user.created_at
      })),
      meta: {
        totalItems: totalDocuments,
        currentPage: query.page,
        totalPages: totalPages,
        sortBy: [['username', 'ASC']],
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

export async function postUserHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  // All log statements are written to CloudWatch
  console.debug('Received event:', event);

  // Authenticate using JWT in `Authorization` header
  const jwtAuthResult = await jwtAuthenticationMiddleware(event);
  const isNotJwtPayload = !(jwtAuthResult instanceof JwtPayload);
  if (isNotJwtPayload) return jwtAuthResult as APIGatewayProxyResult;

  if (event.body === null) {
    console.log("400 - POST /users - Body is null")
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Bad Request' })
    };
  }

  // Validates body
  const requestBody = JSON.parse(event.body);

  /**
   * Should checklist the body based on `CreateUserDto`
   */
  if (
    typeof requestBody.username !== 'string' ||
    typeof requestBody.email !== 'string' ||
    typeof requestBody.password !== 'string'
  ) {
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

    const usersCollection = db.collection<UserDoc>('users');
    const user = {
      username: requestBody?.username,
      email: requestBody?.email,
      password: 'randompass',
      rooms: [], // Should join the default room
      created_at: new Date(),
      updated_at: null
    }
    const result = await usersCollection.insertOne(user);
    const userBodyResponse: UserDto = {
      id: result.insertedId.toString(),
      username: requestBody.username,
      email: requestBody.email,
      rooms: [],
      created_at: user.created_at
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