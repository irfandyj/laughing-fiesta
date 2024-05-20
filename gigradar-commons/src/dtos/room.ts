import { Document, ObjectId } from "mongodb";
import { Query } from "../http/request";
import { MessageDoc } from "./message";

export interface RoomAttrs {
  name: string;
  description: string;
  users: ObjectId[];
  messages: ObjectId[];
}

export interface RoomDoc extends Document {
  name: string;
  description: string;
  users: ObjectId[]; // I think this should be UserDoc[]
  messages: ObjectId[]; // MessageDoc[], but adjust later
  created_at: Date;
  updated_at: Date | null;
}

/**
 * Data Transfer Objects - Input
 */
export interface IndexRoomDto extends Query<RoomDoc> {
}

export interface CreateRoomDto {
  name: string;
  description?: string;
  users: ObjectId[];
  messages: ObjectId[];
}

/**
 * Data Transfer Objects - Output
 */
export interface RoomDto {
  id: string;
  name: string;
  description: string;
  created_at: Date;
}

export interface RoomDetailsDto {
  id: string;
  name: string;
  description: string;
  users: ObjectId[];
  messages: ObjectId[] | MessageDoc[];
  created_at: Date;
  updated_at: Date | null;
}