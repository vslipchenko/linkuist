import {RecordId} from '../graphql/graphql.interfaces';
import {UserRole} from '~app/types/user/user.enums';

// TODO refactor gql specific interfaces
export interface UserIdByEmail {
  userByEmail: RecordId;
}

export interface UserIdByUsername {
  userByUsername: RecordId;
}

export interface UserSignUpData {
  email: string;
  username: string;
  password: string;
}

export interface UserSignInData {
  email: string;
  password: string;
}

export interface ResolvedUser {
  role: UserRole;
  urlUsername: string;
}
