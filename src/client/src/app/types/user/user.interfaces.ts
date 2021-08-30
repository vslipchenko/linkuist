import {RecordId} from '../graphql/graphql.interfaces';
import {UserRole} from '~app/types/user/user.enums';

type UserEmail = {
  email: string;
};

// TODO refactor gql specific interfaces
export interface UserEmailByEmailQueryResult {
  userByEmail: UserEmail;
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
  id: string; // Resolved user _id
  role: UserRole;
  urlUsername: string;
  //relativePaths: Array<string>; // urlUsername relative paths
}
