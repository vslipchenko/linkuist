import {Injectable} from '@angular/core';
import {RequestParameters} from '~app/types/shared/shared.interfaces';
import {Observable} from 'rxjs';
import {ApolloQueryResult, FetchResult} from '@apollo/client/core';
import {Apollo} from 'apollo-angular';
import {GET_POST_SUBCOMMENTS_BY_COMMENT_ID} from '~app/graphql/post-subcomment/post-subcomment.queries';
import {
  PostSubcommentCreateMutationResult,
  PostSubcommentCreatePayload,
  PostSubcommentsByCommentIdQueryResult,
} from '~app/types/post-subcomment/post-subcomment.interfaces';
import {CREATE_POST_SUBCOMMENT} from '~app/graphql/post-subcomment/post-subcomment.mutations';

@Injectable({
  providedIn: 'root',
})
export class PostSubcommentService {
  public constructor(private readonly apollo: Apollo) {}

  public create(
    input: PostSubcommentCreatePayload,
  ): Observable<FetchResult<PostSubcommentCreateMutationResult>> {
    return this.apollo.mutate({
      mutation: CREATE_POST_SUBCOMMENT,
      variables: {input},
    });
  }

  public getByCommentId(
    commentId: string,
    skipProfileTeaserIds: Array<string>,
    parameters: RequestParameters,
  ): Observable<ApolloQueryResult<PostSubcommentsByCommentIdQueryResult>> {
    return this.apollo.query({
      query: GET_POST_SUBCOMMENTS_BY_COMMENT_ID,
      variables: {commentId, skipProfileTeaserIds, parameters},
      fetchPolicy: 'network-only', // Prevents cached results; https://www.apollographql.com/docs/react/data/queries/#supported-fetch-policies
    });
  }
}
