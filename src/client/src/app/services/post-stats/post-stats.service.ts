import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Observable} from 'rxjs';
import {FetchResult} from '@apollo/client/core';
import {LIKE_POST} from '~app/graphql/post-stats/post-stats.mutations';
import {State} from '~app/types/shared/shared.enums';
import {LikePostMutationResult} from '~app/types/post-stats/post-stats.interfaces';

@Injectable({
  providedIn: 'root',
})
export class PostStatsService {
  public constructor(private readonly apollo: Apollo) {}

  public like(input: {
    postId: string;
    like: State;
  }): Observable<FetchResult<LikePostMutationResult>> {
    return this.apollo.mutate({
      mutation: LIKE_POST,
      variables: {input},
    });
  }
}
