import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Observable} from 'rxjs';
import {FetchResult} from '@apollo/client/core';
import {CREATE_POST_COMMENT} from '~app/graphql/post-comment/post-comment.mutations';
import {
  PostCommentCreateMutationResult,
  PostCommentCreatePayload,
} from '~app/types/post-comment/post-comment.interfaces';

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
}
