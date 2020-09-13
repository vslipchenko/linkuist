import {RecordId} from "./graphql.model";

interface UserByEmail<T = RecordId> {
  userByEmail: T
}

interface UserByUsername<T = RecordId> {
  userByUsername: T
}

export interface UserIdByEmail extends UserByEmail {}
export interface UserIdByUsername extends UserByUsername {}

export interface UserSignUpData {
  email: string;
  username: string;
  password: string;
}
