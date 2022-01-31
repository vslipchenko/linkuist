import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {State} from '~app/types/shared/shared.enums';
import {Observable} from 'rxjs';
import {FetchResult} from '@apollo/client/core';
import {LikePostReplyMutationResult} from '~app/types/post-reply-stats/post-reply-stats.interfaces';
import {LIKE_POST_REPLY} from '~app/graphql/post-reply-stats/post-reply-stats.mutations';

@Injectable({
  providedIn: 'root',
})
export class PostReplyStatsService {
  public constructor(private readonly apollo: Apollo) {}

  public like(input: {
    replyId: string;
    like: State;
  }): Observable<FetchResult<LikePostReplyMutationResult>> {
    return this.apollo.mutate({
      mutation: LIKE_POST_REPLY,
      variables: {input},
    });
  }
}
