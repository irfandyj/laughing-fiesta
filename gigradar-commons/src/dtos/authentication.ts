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
export interface UserAuthenticationRoomDto extends Partial<RoomDoc> {
  id: string;
  name: string;
  description: string;
}
export interface UserAuthenticationDto {
  id: string;
  username: string;
  email: string;
  rooms: UserAuthenticationRoomDto[];
  created_at: Date;
  token: string;
}