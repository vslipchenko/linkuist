import {RecordId} from "../graphql/graphql.interfaces";
// TODO refactor gql specific interfaces
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

export interface UserSignInData {
  email: string;
  password: string;
}
