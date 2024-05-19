import { ObjectId } from "mongodb";
import { RoomDoc } from "./room";

/**
 * Data Transfer Objects - Input
 */
export interface SignUpDto {
  name: string;
  email: string;
  password: string;
}

/**
 * Data Transfer Objects - Output
 */
export interface UserSignUpDto {
  id: string;
  name: string;
  email: string;
  rooms: ObjectId[] | RoomDoc[];
  created_at: Date;
  token: string;
}