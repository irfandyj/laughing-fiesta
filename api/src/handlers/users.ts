import 'source-map-support/register';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda';

interface User {
  id: string;
  name: string;
  email: string;
}

interface QueryDto {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

interface GetUserDto {
  users: User[];
  query: QueryDto;
}

/**
 * A simple example includes a HTTP get method.
 */
export const getUsersHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  // All log statements are written to CloudWatch
  console.debug('Received event:', event);

  const usersResponse: GetUserDto = {
    users: [
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
    query: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 2
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(usersResponse)
  };
}
