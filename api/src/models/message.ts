import { Document, ObjectId } from "mongodb";

export interface MessageAttrs {
  content: string;
  attachments: string[];
  replies: ObjectId[]; // MessageDoc[]
  room: ObjectId; // RoomDoc
  by: ObjectId; // UserDoc
}

export interface MessageDoc extends Document {
  content: string;
  attachments: string[];
  replies: ObjectId[]; // MessageDoc[]
  room: ObjectId; // RoomDoc
  by: ObjectId; // UserDoc
  created_at: Date;
  updated_at: Date | null;
}

/**
 * Data Transfer Objects - Input
 */

/**
 * Data Transfer Objects - Output
 */
export interface MessageDto {
  id: string;
  content: string;
  attachments: string[];
  replies: ObjectId[]; // MessageDoc[]
  room: ObjectId; // RoomDoc
  by: ObjectId; // UserDoc
  created_at: Date;
  updated_at: Date | null;
}