import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {UPDATE_PROFILE} from '~app/graphql/profile/profile.mutations';
import {
  ProfileByUserIdQueryResult,
  ProfileByUsernameQueryResult,
  ProfileUpdateMutationResult,
  ProfileUpdatePayload,
} from '~app/types/profile/profile.interfaces';
import {
  GET_PROFILE_BY_USER_ID,
  GET_PROFILE_BY_USERNAME,
} from '~app/graphql/profile/profile.queries';
import {Observable} from 'rxjs';
import {ApolloQueryResult, FetchResult} from '@apollo/client/core';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  public constructor(private readonly apollo: Apollo) {}

  public update(input: ProfileUpdatePayload): Observable<FetchResult<ProfileUpdateMutationResult>> {
    return this.apollo.mutate({
      mutation: UPDATE_PROFILE,
      variables: {input},
    });
  }

  public getByUserId(userId: string): Observable<ApolloQueryResult<ProfileByUserIdQueryResult>> {
    return this.apollo.query({
      query: GET_PROFILE_BY_USER_ID,
      variables: {userId},
    });
  }

  public getByUsername(
    username: string,
  ): Observable<ApolloQueryResult<ProfileByUsernameQueryResult>> {
    return this.apollo.query({
      query: GET_PROFILE_BY_USERNAME,
      variables: {username},
    });
  }
}
