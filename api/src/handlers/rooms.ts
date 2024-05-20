import 'source-map-support/register';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda';
import { getMongoClient } from '../db/init';
import { SORT_ORDER, SortQuery } from '../lib/request';
import { GetResponse } from '../lib/response';
import { RoomDoc, IndexRoomDto, RoomDto, RoomDetailsDto } from 'gigradar-commons/build/dtos/room';
import { Entities } from '../lib/entitites';
import { ObjectId, UpdateFilter } from 'mongodb';
import { MessageDoc, MessageDto } from 'gigradar-commons/build/dtos/message';
import { JwtPayload, jwtAuthenticationMiddleware } from '../lib/authentication';

const CLIENT_HOST = "http://localhost:3000"

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

    /**
     * Checklist IndexRoomDto
     */
    const qs = event.queryStringParameters;
    const query: IndexRoomDto = {
      limit: 10,
      page: 1,
      sortBy: ['created_at', SORT_ORDER.DESC],
      filter: {}
    }
    if (qs) {
      query.limit = qs.limit ? parseInt(qs.limit) : 10;
      query.page = qs.page ? parseInt(qs.page) : 1;

      // Sort out sorts
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

      // Filter where name or email contains the query string
      query.filter = qs.filter ? {
        $or: [
          { name: { $regex: qs.filter, $options: 'i' } },
          { description: { $regex: qs.filter, $options: 'i' } }
        ]
      } : {}
    }

    // Get the rooms collection
    const roomsCollection = db.collection<RoomDoc>(Entities.ROOMS);

    // Get all rooms
    const rooms = await roomsCollection.find<RoomDoc>(query.filter, {
      limit: query.limit,
      skip: (query.page - 1) * query.limit,
      sort: {
        [query.sortBy[0]]: query.sortBy[1] === 'ASC' ? 1 : -1
      }
    }).toArray();

    const totalDocuments = await roomsCollection.countDocuments(query.filter);
    const totalPages = Math.ceil(totalDocuments / query.limit);
    const roomsResponse: GetResponse<RoomDto> = {
      data: rooms.map(room => ({
        id: room._id,
        name: room.name,
        description: room.description,
        created_at: room.created_at,
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

export async function showRoomHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  // All log statements are written to CloudWatch
  console.debug('Received event:', event);

  // Validates path parameters
  if (!event.pathParameters || !event.pathParameters.id) {
    console.log("400 - GET /rooms - Room ID is not provided")
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Bad Request' })
    };
  }
  const roomId = event.pathParameters.id;

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

    const roomsCollection = db.collection<RoomDoc>(Entities.ROOMS);
    const room = await roomsCollection.findOne({ _id: new ObjectId(roomId) });

    if (!room) {
      console.log("404 - GET /rooms - Room not found")
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Not Found' })
      };
    }

    const roomResponse: RoomDetailsDto = {
      id: room._id.toString(),
      name: room.name,
      description: room.description,
      users: room.users,
      messages: room.messages,
      created_at: room.created_at,
      updated_at: room.updated_at
    }

    await closeConnection();
    return {
      statusCode: 200,
      body: JSON.stringify(roomResponse)
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
  const requestBody = JSON.parse(event.body);
  
  /** Checklist CreateRoomDto */
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

    const roomsCollection = db.collection<RoomDoc>(Entities.ROOMS);
    const room = {
      name: requestBody?.name,
      description: requestBody.description ? requestBody.description : '',
      users: [],
      messages: [],
      created_at: new Date(),
      updated_at: null,
    }

    console.log("POST /rooms - Inserting a room named " + room.name)
    const result = await roomsCollection.insertOne(room);

    // Preparing response
    const createRoomResponse: RoomDetailsDto = {
      id: result.insertedId.toString(),
      name: requestBody.name,
      description: requestBody.description ? requestBody.description : '',
      users: [],
      messages: [],
      created_at: result.insertedId.getTimestamp(),
      updated_at: null,
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

/**
 * Other related functions with rooms
 */

/**
 * Post message to a room
 */
export async function postMessageToRoomHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  // All log statements are written to CloudWatch
  console.debug('Received event:', event);

  // Authenticate using JWT in `Authorization` header
  const jwtAuthResult = await jwtAuthenticationMiddleware(event);
  const isNotJwtPayload = !(jwtAuthResult instanceof JwtPayload);
  if (isNotJwtPayload) return jwtAuthResult as APIGatewayProxyResult;

  if (event.body === null) {
    console.log("400 - POST /rooms/{id}/messages - Body is null")
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Bad Request' })
    };
  }

  // Validates path parameters
  if (!event.pathParameters || !event.pathParameters.id) {
    console.log("400 - POST /rooms/{id}/messages - Room ID is not provided")
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Bad Request' })
    };
  }
  const roomId = event.pathParameters.id;

  // Validates body
  const requestBody = JSON.parse(event.body);
  if (typeof requestBody.content !== 'string') {
    console.log("400 - POST /rooms/{id}/messages - Body is not valid")
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Bad Request' })
    };
  }

  try {
    const mongoClient = await getMongoClient();
    if (!mongoClient || !mongoClient.db || !mongoClient.closeConnection) {
      console.log("500 - POST /rooms/{id}/messages - Error connecting to DB")
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal Server Error' })
      };
    }
    const { db, closeConnection } = mongoClient;

    const roomsCollection = db.collection<RoomDoc>(Entities.ROOMS);
    const room = await roomsCollection.findOne({ _id: new ObjectId(roomId) });

    if (!room) {
      console.log(`404 - POST /rooms/{id}/messages - Room with ID of ${roomId} not found`)
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Not Found' })
      };
    }

    // Start validating
    // Missing future feature:
    // 1. Message with attachments
    const message: MessageDoc = {
      content: requestBody.content,
      attachments: [], // Should be updated later
      replies: [],
      room: room._id,
      by: new ObjectId(jwtAuthResult.sub),
      created_at: new Date(),
      updated_at: null,
    }
    const messagesCollection = db.collection<MessageDoc>(Entities.MESSAGES);

    console.log("POST /rooms/{id}/messages - Inserting a message to the collection")
    const insertMessageResult = await messagesCollection.insertOne(message);
    
    console.log("POST /rooms/{id}/messages - Inserting a message to room " + room.name)
    const updateRoomResult = await roomsCollection.updateOne(
      { _id: room._id },
      { $push: { messages: insertMessageResult.insertedId } } as unknown as UpdateFilter<RoomDoc>
    );

    if (updateRoomResult.modifiedCount === 0) {
      console.log("500 - POST /rooms/{id}/messages - Error updating room")
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal Server Error' })
      };
    }

    // Preparing response
    const createMessageResponse: MessageDto = {
      id: insertMessageResult.insertedId.toString(),
      content: requestBody.content,
      attachments: [],
      replies: [],
      room: new ObjectId(roomId),
      by: {
        id: jwtAuthResult.sub,
        name: jwtAuthResult.username,
        email: jwtAuthResult.email
      },
      created_at: message.created_at,
      updated_at: message.updated_at,
    }
    console.log(`POST /rooms/{id}/messages - Message created successfully`)

    await closeConnection();
    return {
      statusCode: 200,
      body: JSON.stringify(createMessageResponse)
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