import {EffectOptions, Effects} from '@ng-estate/store';
import {PostsState} from '~app/modules/profile/modules/posts/store/index';
import {PostsActions} from '~app/modules/profile/modules/posts/store/posts.actions';
import {PostService} from '~app/services/post/post.service';
import {of, tap} from 'rxjs';
import {ApolloQueryResult, FetchResult} from '@apollo/client/core';
import {
  PostCreateMutationResult,
  PostDeleteCountMutationResult,
  PostsByUserIdQueryResult,
  UIPost,
} from '~app/types/post/post.interfaces';
import {DateService} from '~app/shared/services/date/date.service';
import {TranslateService} from '@ngx-translate/core';
import {getPostFullDate, getPostShortDate, getTimeElapsedAfterCreation$} from '~app/utilities/post';
import {PostCommentService} from '~app/services/post-comment/post-comment.service';
import {PostCommentCreatePayload} from '~app/types/post-comment/post-comment.interfaces';
import {SortOrder} from '~app/types/shared/shared.enums';
import {POST_FETCH_LIMIT} from '~app/constants/post';
import {ProfileTeasers} from '~app/types/profile/profile.interfaces';
import {hasLessMillisecondsThanDay} from '~app/utilities/date';

export const PostsEffects: Effects<PostsState> = {
  [PostsActions.createPost]: ({dispatch, payload, injector}: EffectOptions<PostsState, string>) => {
    const postService = injector.get(PostService);
    const dateService = injector.get(DateService);
    const translateService = injector.get(TranslateService);

    return postService
      .create({
        text: payload,
      })
      .pipe(
        tap(({data}: FetchResult<PostCreateMutationResult>) => {
          const {createdAt} = data!.createPost;
          // Assume userId is equal to id of current user
          // this.profileTeasers[userId] = {
          //   avatarUrl: this.avatarUrl,
          //   username: this.resolvedUserService.user.urlUsername,
          // };

          const post: UIPost = {
            ...data!.createPost,
            // millisecondsElapsed: dateService.serverUtcTimestamp - createdAt,
            date: getPostFullDate(createdAt, translateService),
            timeElapsedAfterCreation$: getTimeElapsedAfterCreation$({
              createdAt,
              translateService,
              dateService,
            }),
            // userId: this.authenticationService.accessTokenData?.userId,
          };

          // newPost.timeElapsedAfterCreation$ = getTimeElapsedAfterCreation$({
          //   createdAt,
          //   translateService,
          //   dateService,
          // });

          // this.posts.unshift(newPost);

          dispatch(PostsActions.prependPost, post);
        }),
      );
  },
  [PostsActions.deletePost]: ({dispatch, payload, injector}: EffectOptions<PostsState, string>) => {
    const postService = injector.get(PostService);

    return postService.deleteById(payload).pipe(
      tap(({data}: FetchResult<PostDeleteCountMutationResult>) => {
        if (!data?.deletePost) return;

        dispatch(PostsActions.removePost, payload);
      }),
    );
  },
  [PostsActions.createPostComment]: ({
    payload,
    injector,
  }: EffectOptions<PostsState, PostCommentCreatePayload>) => {
    const postCommentService = injector.get(PostCommentService);

    return postCommentService.create(payload).pipe(
      // TODO...
      tap(),
    );
  },
  [PostsActions.loadPosts]: ({
    dispatch,
    payload,
    injector,
  }: EffectOptions<
    PostsState,
    {resolvedUserId: string; offset: number; order?: SortOrder; limit?: number}
  >) => {
    const postService = injector.get(PostService);

    return postService
      .getAllByUserId(payload.resolvedUserId, {
        order: SortOrder.DESCENDING,
        offset: payload.offset,
        limit: POST_FETCH_LIMIT,
      })
      .pipe(
        tap(({data}: ApolloQueryResult<PostsByUserIdQueryResult>) => {
          const translateService = injector.get(TranslateService);
          const dateService = injector.get(DateService);

          const profileTeasers: ProfileTeasers = {};
          const serverUtcTimestamp = dateService.serverUtcTimestamp;

          data.postsByUserId.userProfileTeasers.forEach((teaser) => {
            profileTeasers[teaser._id] = {
              // Where profile/teaser _id is equal to user id
              avatarUrl: teaser.profile?.avatarUrl,
              username: teaser.username,
            };
          });

          const posts = data.postsByUserId.posts.data.map((post) => {
            const newPost: Partial<UIPost> = {...post};

            // newPost.millisecondsElapsed = dateService.serverUtcTimestamp - post.createdAt;
            newPost.date = getPostFullDate(post.createdAt, translateService);

            if (hasLessMillisecondsThanDay(serverUtcTimestamp - post.createdAt)) {
              newPost.timeElapsedAfterCreation$ = getTimeElapsedAfterCreation$({
                createdAt: post.createdAt,
                dateService,
                translateService,
              });

              return newPost;
            }

            newPost.timeElapsedAfterCreation$ = of(
              getPostShortDate({
                createdAt: post.createdAt,
                serverUtcTimestamp: serverUtcTimestamp,
                translateService,
              }),
            );

            // newPost.timeElapsedAfterCreation = getPostShortDate(
            //   post.createdAt,
            //   this.dateService.serverUtcTimestamp,
            // );

            return newPost;
          });

          dispatch(PostsActions.appendPosts, posts);
        }),
      );
  },
};
