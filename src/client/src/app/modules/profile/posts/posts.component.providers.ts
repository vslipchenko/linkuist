// import {InjectionToken, Provider} from '@angular/core';
// import {Observable} from 'rxjs';
// import {PostService} from '~app/services/post/post.service';
// import {ResolvedUser} from '~app/types/user/user.interfaces';
// import {UserRole} from '~app/types/user/user.enums';
// import {AuthenticationService} from '~app/services/authentication/authentication.service';
// import {RequestParameters} from '~app/types/shared/shared.interfaces';
// import {ApolloQueryResult} from '@apollo/client/core';
// import {
//   PostsByUserIdQueryResult,
//   PostsByUsernameQueryResult,
// } from '~app/types/post/post.interfaces';
//
// /* User posts */
// export const USER_POSTS = new InjectionToken<Observable<unknown>>(
//   'A stream with current organization information',
// );
//
// export const USER_POSTS_PROVIDERS: Array<Provider> = [
//   {
//     provide: USER_POSTS,
//     deps: [PostService, AuthenticationService],
//     useFactory: userPostsFactory,
//   },
// ];
//
// export function userPostsFactory(
//   postService: PostService,
//   authenticationService: AuthenticationService,
// ): (
//   resolvedUser: ResolvedUser,
//   parameters: RequestParameters,
// ) => Observable<ApolloQueryResult<PostsByUserIdQueryResult | PostsByUsernameQueryResult>> {
//   return (
//     resolvedUser: ResolvedUser,
//     parameters: RequestParameters,
//   ): Observable<ApolloQueryResult<PostsByUserIdQueryResult | PostsByUsernameQueryResult>> => {
//     const hasUserRole = resolvedUser.role === UserRole.USER;
//
//     return postService[hasUserRole ? 'getAllByUserId' : 'getAllByUsername'](
//       hasUserRole ? authenticationService.accessTokenData!.userId : resolvedUser.urlUsername,
//       parameters,
//     );
//     // ...
//   };
// }
