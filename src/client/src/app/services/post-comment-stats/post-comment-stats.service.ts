import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {State} from '~app/types/shared/shared.enums';
import {Observable} from 'rxjs';
import {FetchResult} from '@apollo/client/core';
import {LikePostCommentMutationResult} from '~app/types/post-comment-stats/post-comment-stats.interfaces';
import {LIKE_POST_COMMENT} from '~app/graphql/post-comment-stats/post-comment-stats.mutations';

@Injectable({
  providedIn: 'root',
})
export class PostCommentStatsService {
  public constructor(private readonly apollo: Apollo) {}

  public like(input: {
    commentId: string;
    like: State;
  }): Observable<FetchResult<LikePostCommentMutationResult>> {
    return this.apollo.mutate({
      mutation: LIKE_POST_COMMENT,
      variables: {input},
    });
  }
}
