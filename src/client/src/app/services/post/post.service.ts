import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {CREATE_POST} from '~app/graphql/post/post.mutations';
import {PostCreatePayload} from '~app/types/post/post.interfaces';
import {Observable} from 'rxjs';
import {FetchResult} from '@apollo/client/core';
import {RecordId} from '~app/types/graphql/graphql.interfaces';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  public constructor(private readonly apollo: Apollo) {}

  public create(input: PostCreatePayload): Observable<FetchResult<RecordId>> {
    return this.apollo.mutate({
      mutation: CREATE_POST,
      variables: {input: {...input, isRepost: false}},
    });
  }
}
