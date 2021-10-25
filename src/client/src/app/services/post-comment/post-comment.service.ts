import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Observable} from 'rxjs';
import {ApolloQueryResult, FetchResult} from '@apollo/client/core';
import {CREATE_POST_COMMENT} from '~app/graphql/post-comment/post-comment.mutations';
import {
  PostCommentCreateMutationResult,
  PostCommentCreatePayload,
  PostCommentsByPostIdQueryResult,
} from '~app/types/post-comment/post-comment.interfaces';
import {RequestParameters} from '~app/types/shared/shared.interfaces';
import {GET_POST_COMMENTS_BY_POST_ID} from '~app/graphql/post-comment/post-comment.queries';

@Injectable({
  providedIn: 'root',
})
export class PostCommentService {
  public constructor(private readonly apollo: Apollo) {}

  public create(
    input: PostCommentCreatePayload,
  ): Observable<FetchResult<PostCommentCreateMutationResult>> {
    return this.apollo.mutate({
      mutation: CREATE_POST_COMMENT,
      variables: {input},
    });
  }

  public getByPostId(
    postId: string,
    skipProfileTeaserIds: Array<string>,
    parameters: RequestParameters,
  ): Observable<ApolloQueryResult<PostCommentsByPostIdQueryResult>> {
    return this.apollo.query({
      query: GET_POST_COMMENTS_BY_POST_ID,
      variables: {postId, skipProfileTeaserIds, parameters},
    });
  }
}
