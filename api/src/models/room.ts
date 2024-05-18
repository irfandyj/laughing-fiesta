import { ObjectId } from "mongodb";

export interface Room {
  id?: ObjectId;
  name: string;
  description: string;
  users: ObjectId[];
  messages: ObjectId[];
}