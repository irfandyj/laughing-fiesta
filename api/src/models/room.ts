import { Document, ObjectId } from "mongodb";

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
 * Data Transfer Objects
 */
export interface IndexRoomDto {
  id: string;
  name: string;
  description: string;
  users: ObjectId[];
  messages: ObjectId[];
  created_at: Date;
  updated_at: Date | null;
}

export interface CreateRoomDto {
  id: string;
  name: string;
  description: string;
  users: ObjectId[];
  messages: ObjectId[];
  created_at: Date;
  updated_at: Date | null;
}