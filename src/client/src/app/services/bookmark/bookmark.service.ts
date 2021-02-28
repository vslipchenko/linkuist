import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {CREATE_BOOKMARK} from '@graphql/bookmark/bookmark.mutations';
import {Observable} from 'rxjs';
import {FetchResult} from '@apollo/client/core';
import {RecordId} from '@@types/graphql/graphql.interfaces';
import {BookmarkCreateData} from '@@types/bookmark/bookmark.interfaces';

@Injectable({
  providedIn: 'root',
})
export class BookmarkService {
  public constructor(private readonly apollo: Apollo) {}

  public create({
    id,
    link,
    title,
    image,
    icon,
    description,
    tags,
  }: BookmarkCreateData): Observable<FetchResult<RecordId>> {
    return this.apollo.mutate({
      mutation: CREATE_BOOKMARK,
      variables: {input: {id, link, title, image, icon, description, tags}},
    });
  }
}
