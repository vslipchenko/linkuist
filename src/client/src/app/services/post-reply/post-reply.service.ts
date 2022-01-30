import {Injectable} from '@angular/core';
import {RequestParameters} from '~app/types/shared/shared.interfaces';
import {Observable} from 'rxjs';
import {ApolloQueryResult, FetchResult} from '@apollo/client/core';
import {Apollo} from 'apollo-angular';
import {GET_POST_REPLIES_BY_COMMENT_ID} from '~app/graphql/post-reply/post-reply.queries';
import {
  DeletePostReplyMutationResult,
  PostReplyCreateMutationResult,
  PostReplyCreatePayload,
  PostRepliesByCommentIdQueryResult,
} from '~app/types/post-reply/post-reply.interfaces';
import {CREATE_POST_REPLY, DELETE_POST_REPLY} from '~app/graphql/post-reply/post-reply.mutations';

@Injectable({
  providedIn: 'root',
})
export class PostReplyService {
  public constructor(private readonly apollo: Apollo) {}

  public create(
    input: PostReplyCreatePayload,
  ): Observable<FetchResult<PostReplyCreateMutationResult>> {
    return this.apollo.mutate({
      mutation: CREATE_POST_REPLY,
      variables: {input},
    });
  }

  public getByCommentId(
    commentId: string,
    skipPostReplyIds: Array<string>,
    skipProfileTeaserIds: Array<string>,
    parameters: RequestParameters,
  ): Observable<ApolloQueryResult<PostRepliesByCommentIdQueryResult>> {
    return this.apollo.query({
      query: GET_POST_REPLIES_BY_COMMENT_ID,
      variables: {commentId, skipPostReplyIds, skipProfileTeaserIds, parameters},
      fetchPolicy: 'network-only', // Prevents cached results; https://www.apollographql.com/docs/react/data/queries/#supported-fetch-policies
    });
  }

  public deleteById(replyId: string): Observable<FetchResult<DeletePostReplyMutationResult>> {
    return this.apollo.mutate({
      mutation: DELETE_POST_REPLY,
      variables: {replyId},
    });
  }
}
