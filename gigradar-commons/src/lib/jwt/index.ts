import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import jwt from 'jsonwebtoken';

/**
 * JWT Token related functions
 */
const JWT_SECRET = "secret";

export class JwtPayload {
  sub: string;
  username: string;
  email: string;
  constructor({ sub, username, email }: { sub: string, username: string, email: string }) {
    this.sub = sub;
    this.username = username;
    this.email = email;
  }
}

export async function generateJwtToken(payload: JwtPayload): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET, function (err, token) {
      if (err) reject(err);
      if (typeof token === 'string') resolve(token);
      reject(new Error('Failed to generate token'))
    });
  });
}

/**
 * Receives a JWT token and returns the `JwtPayload`
 * @param token 
 * @returns
 */
export async function verifyJwtToken(token: string): Promise<JwtPayload> {
  return new Promise((resolve, reject) => {
    console.log("Verifying token ...")
    jwt.verify(token, JWT_SECRET, function (err, decoded) {
      if (err) reject(err);
      if (decoded) {
        if (typeof decoded === 'string') reject(new Error('Failed to verify token'))
        // Check each property of `JwtPayload`
        if (
          typeof decoded === 'object' &&
          typeof decoded.sub === 'string' &&
          typeof decoded.username === 'string' &&
          typeof decoded.email === 'string'
        ) {
          console.log("Token decoded!")
          console.log("Sub: ", decoded.sub)
          console.log("username: ", decoded.username)
          console.log("Email: ", decoded.email)
          resolve(new JwtPayload(decoded as JwtPayload))
        }
      }
      reject(new Error('Failed to verify token'));
    });
  });
}

/**
 * Extracts the JWT token from the `Authorization` header
 */
export async function jwtAuthenticationMiddleware(
  event: APIGatewayProxyEvent
): Promise<JwtPayload | APIGatewayProxyResult> {
  if (!event.headers.Authorization) {
    console.log("401 - No Authorization Header - Unauthorized")
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized' })
    };
  }
  const token = event.headers.Authorization.replace('Bearer ', '');

  try {
    const payload = await verifyJwtToken(token);
    return payload;
  } catch (e) {
    console.error(e)
    console.log("401 - Failed to verify token - Unauthorized")
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized' })
    };
  }
}