import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {CREATE_USER} from '~app/graphql/user/user.mutations';
import {
  UserIdByEmailQueryResult,
  UserIdByUsernameQueryResult,
  UserSignUpPayload,
} from '~app/types/user/user.interfaces';
import {Observable} from 'rxjs';
import {ApolloQueryResult, FetchResult} from '@apollo/client/core';
import {RecordId} from '~app/types/graphql/graphql.interfaces';
import {
  GET_PROFILE_BY_USER_ID,
  GET_PROFILE_BY_USERNAME,
  GET_PROFILE_TEASER_BY_USER_ID,
  GET_PROFILE_TEASER_BY_USERNAME,
  USER_ID_BY_EMAIL,
  USER_ID_BY_USERNAME,
} from '~app/graphql/user/user.queries';
import {
  ProfileByUserIdQueryResult,
  ProfileByUsernameQueryResult,
  ProfileUpdateMutationResult,
  ProfileUpdatePayload,
} from '~app/types/profile/profile.interfaces';
import {UPDATE_PROFILE} from '~app/graphql/profile/profile.mutations';
// import {
//   GET_PROFILE_BY_USER_ID,
//   GET_PROFILE_BY_USERNAME
// } from "~app/graphql/profile/profile.queries";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public constructor(private readonly apollo: Apollo) {}

  public create(input: UserSignUpPayload): Observable<FetchResult<RecordId>> {
    return this.apollo.mutate({
      mutation: CREATE_USER,
      variables: {input},
    });
  }

  public getUserIdByEmail(email: string): Observable<ApolloQueryResult<UserIdByEmailQueryResult>> {
    return this.apollo.query({
      query: USER_ID_BY_EMAIL,
      variables: {email},
    });
  }

  public getUserIdByUsername(
    username: string,
  ): Observable<ApolloQueryResult<UserIdByUsernameQueryResult>> {
    return this.apollo.query({
      query: USER_ID_BY_USERNAME,
      variables: {username},
    });
  }

  public updateProfile(
    input: ProfileUpdatePayload,
  ): Observable<FetchResult<ProfileUpdateMutationResult>> {
    return this.apollo.mutate({
      mutation: UPDATE_PROFILE,
      variables: {input},
    });
  }

  public getProfileByUserId(
    userId: string,
  ): Observable<ApolloQueryResult<ProfileByUserIdQueryResult>> {
    return this.apollo.query({
      query: GET_PROFILE_BY_USER_ID,
      variables: {userId},
    });
  }

  public getProfileByUsername(
    username: string,
  ): Observable<ApolloQueryResult<ProfileByUsernameQueryResult>> {
    return this.apollo.query({
      query: GET_PROFILE_BY_USERNAME,
      variables: {username},
    });
  }

  public getProfileTeaserByUserId(userId: string): Observable<ApolloQueryResult<unknown>> {
    return this.apollo.query({
      query: GET_PROFILE_TEASER_BY_USER_ID,
      variables: {userId},
    });
  }

  public getProfileTeaserByUsername(username: string): Observable<ApolloQueryResult<unknown>> {
    return this.apollo.query({
      query: GET_PROFILE_TEASER_BY_USERNAME,
      variables: {username},
    });
  }
}
