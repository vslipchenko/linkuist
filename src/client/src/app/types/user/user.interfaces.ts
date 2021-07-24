import {RecordId} from '../graphql/graphql.interfaces';
import {UserRole} from '~app/types/user/user.enums';

// TODO refactor gql specific interfaces
export interface UserIdByEmailQueryResult {
  userByEmail: RecordId;
}

export interface UserIdByUsernameQueryResult {
  userByUsername: RecordId;
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
  role: UserRole;
  urlUsername: string;
  relativePaths: Array<string>; // urlUsername relative paths
}
