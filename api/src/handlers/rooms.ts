import 'source-map-support/register';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda';
import { getMongoClient } from '../db/init';
import { GetResponse } from '../lib/response';
import { Room } from '../models/room';
import { ObjectId, Document, Filter } from 'mongodb';
import { Entities } from '../lib/entitites';

const CLIENT_HOST = "http://localhost:3000"

interface Query {
  limit: number;
  page: number;
  sortBy: [string, 'ASC' | 'DESC'];
  filter: Filter<RoomDoc>;
}

interface RoomDoc extends Document {
  id: string;
  name: string;
  description: string;
  users: ObjectId[];
  messages: ObjectId[];
}

interface IndexRoomDto {
  id: string;
  name: string;
  description: string;
}

/**
 * A simple example includes a HTTP get method.
 */
export const getRoomsHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  // All log statements are written to CloudWatch
  console.debug('Received event:', event);

  try {
    const mongoClient = await getMongoClient();
    if (!mongoClient || !mongoClient.db || !mongoClient.closeConnection) {
      console.log("500 - GET /rooms - Error connecting to DB")
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
    const roomsCollection = db.collection<RoomDoc>(Entities.ROOMS);

    // Get all users
    const rooms = await roomsCollection.find<RoomDoc>(query.filter, {
      limit: query.limit,
      skip: (query.page - 1) * query.limit,
      sort: {
        [query.sortBy[0]]: query.sortBy[1] === 'ASC' ? 1 : -1
      }
    }).toArray();

    const totalDocuments = await roomsCollection.countDocuments(query.filter);
    const totalPages = Math.ceil(totalDocuments / query.limit);
    const roomsResponse: GetResponse<IndexRoomDto> = {
      data: rooms.map(room => ({
        id: room.id,
        name: room.name,
        description: room.description
      })),
      meta: {
        totalItems: totalDocuments,
        currentPage: query.page,
        totalPages: totalPages,
        sortBy: [['name', 'ASC']],
        limit: query.limit,
      },
      links: {
        first: `${CLIENT_HOST}/rooms?limit=${query.limit}&page=1`,
        previous: query.page > 1 ? `${CLIENT_HOST}/rooms?limit=${query.limit}&page=${query.page - 1}` : '',
        current: `${CLIENT_HOST}/rooms?limit=${query.limit}&page=${query.page}`,
        next: query.page < totalPages ? `${CLIENT_HOST}/rooms?limit=${query.limit}&page=${query.page + 1}` : '',
        last: `${CLIENT_HOST}/rooms?limit=${query.limit}&page=${totalPages}`,
      }
    }
    
    await closeConnection();
    return {
      statusCode: 200,
      body: JSON.stringify(roomsResponse)
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

interface RoomPostBodyRequest extends Partial<Room> {
  name: string;
}

interface CreateRoomDto {
  id: string;
  name: string;
  description: string;
  users: ObjectId[];
  messages: ObjectId[];
}

export async function postRoomHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
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
  const requestBody = JSON.parse(event.body) as RoomPostBodyRequest;
  if (typeof requestBody.name !== 'string') {
    console.log("400 - POST /rooms - Body is not valid")
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Bad Request' })
    };
  }

  try {
    const mongoClient = await getMongoClient();
    if (!mongoClient || !mongoClient.db || !mongoClient.closeConnection) {
      console.log("500 - POST /rooms - Error connecting to DB")
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal Server Error' })
      };
    }
    const { db, closeConnection } = mongoClient;
    console.log("Connection to DB established")

    const roomsCollection = db.collection(Entities.ROOMS);
    const room: Room = {
      name: requestBody?.name,
      description: requestBody.description ? requestBody.description : '',
      users: [],
      messages: []
    }

    console.log("POST /rooms - Inserting a room named " + room.name)
    const result = await roomsCollection.insertOne(room);

    // Preparing response
    const createRoomResponse: CreateRoomDto = {
      id: result.insertedId.toString(),
      name: requestBody.name,
      description: requestBody.description ? requestBody.description : '',
      users: [],
      messages: []
    }
    console.log(`POST /rooms - Room ${createRoomResponse.name} created successfully`)

    await closeConnection();
    return {
      statusCode: 200,
      body: JSON.stringify(createRoomResponse)
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