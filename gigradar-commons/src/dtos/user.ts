import { Document, ObjectId } from "mongodb";
import { Query } from "../http/request";
import { RoomDoc } from "./room";

export interface UserAttrs {
  name: string;
  email: string;
  password: string;
  rooms: ObjectId[];
}

export interface UserDoc extends Document {
  name: string;
  email: string;
  password: string;
  rooms: ObjectId[];
  created_at: Date;
  updated_at: Date | null;
}

/**
 * Data Transfer Objects - Input
 */
export interface IndexUserDto extends Query<UserDoc> {}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  rooms: ObjectId[];
}

/**
 * Data Transfer Objects - Output
 */
export interface UserDto {
  id: string;
  name: string;
  email: string;
  rooms: ObjectId[] | RoomDoc[];
  created_at: Date;
}