import { ObjectId } from "mongodb";
import { RoomDoc } from "./room";

/**
 * Data Transfer Objects - Input
 */
export interface SignUpDto {
  username: string;
  email: string;
  password: string;
}

export interface SignInDto {
  email: string;
  password: string;
}
/**
 * Data Transfer Objects - Output
*/
export interface UserAuthenticationDto {
  id: string;
  username: string;
  email: string;
  rooms: ObjectId[] | RoomDoc[];
  created_at: Date;
  token: string;
}