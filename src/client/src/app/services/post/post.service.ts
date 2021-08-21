import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {CREATE_POST, DELETE_POST} from '~app/graphql/post/post.mutations';
import {
  PostCreateMutationResult,
  PostCreatePayload,
  PostDeleteCountMutationResult,
  PostsByUserIdQueryResult,
  PostsByUsernameQueryResult,
} from '~app/types/post/post.interfaces';
import {Observable} from 'rxjs';
import {ApolloQueryResult, FetchResult} from '@apollo/client/core';
import {GET_POSTS_BY_USER_ID, GET_POSTS_BY_USERNAME} from '~app/graphql/post/post.queries';
import {RequestParameters} from '~app/types/shared/shared.interfaces';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  public constructor(private readonly apollo: Apollo) {}

  public create(input: PostCreatePayload): Observable<FetchResult<PostCreateMutationResult>> {
    return this.apollo.mutate({
      mutation: CREATE_POST,
      variables: {input: {...input, isRepost: false}},
    });
  }

  public getAllByUserId(
    userId: string,
    parameters: RequestParameters,
  ): Observable<ApolloQueryResult<PostsByUserIdQueryResult>> {
    return this.apollo.query({
      query: GET_POSTS_BY_USER_ID,
      variables: {userId, parameters},
    });
  }

  public getAllByUsername(
    username: string,
    parameters: RequestParameters,
  ): Observable<ApolloQueryResult<PostsByUsernameQueryResult>> {
    return this.apollo.query({
      query: GET_POSTS_BY_USERNAME,
      variables: {username, parameters},
    });
  }

  public deleteById(_id: string): Observable<FetchResult<PostDeleteCountMutationResult>> {
    return this.apollo.mutate({
      mutation: DELETE_POST,
      variables: {input: {_id}},
    });
  }
}
