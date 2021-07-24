import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {CREATE_POST} from '~app/graphql/post/post.mutations';
import {
  PostCreateMutationResult,
  PostCreatePayload,
  PostsByUserIdQueryResult,
  PostsByUsernameQueryResult,
} from '~app/types/post/post.interfaces';
import {Observable} from 'rxjs';
import {ApolloQueryResult, FetchResult} from '@apollo/client/core';
import {GET_POSTS_BY_USER_ID, GET_POSTS_BY_USERNAME} from '~app/graphql/post/post.queries';
import {SortOrder} from '~app/types/shared/shared.enums';

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
    order?: SortOrder,
  ): Observable<ApolloQueryResult<PostsByUserIdQueryResult>> {
    return this.apollo.query({
      query: GET_POSTS_BY_USER_ID,
      variables: {userId, order},
    });
  }

  public getAllByUsername(
    username: string,
    order?: SortOrder,
  ): Observable<ApolloQueryResult<PostsByUsernameQueryResult>> {
    return this.apollo.query({
      query: GET_POSTS_BY_USERNAME,
      variables: {username, order},
    });
  }
}
