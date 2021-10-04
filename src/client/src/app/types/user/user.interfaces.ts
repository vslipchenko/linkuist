import {RecordId} from '../graphql/graphql.interfaces';
import {UserRole} from '~app/types/user/user.enums';

interface UserEmail {
  email: string;
}

// TODO refactor gql specific interfaces
export interface UserEmailByEmailQueryResult {
  userEmailByEmail: UserEmail;
}

export interface UserIdByUsernameQueryResult {
  userIdByUsername: RecordId;
}

export interface UserSignUpPayload {
  email: string;
  username: string;
  password: string;
}

export interface UserSignInPayload {
  email: string;
  password: string;
}

export interface ResolvedUser {
  id: string; // Resolved user _id
  role: UserRole;
  urlUsername: string;
  //relativePaths: Array<string>; // urlUsername relative paths
}
