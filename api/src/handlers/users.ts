import 'source-map-support/register';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda';
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
