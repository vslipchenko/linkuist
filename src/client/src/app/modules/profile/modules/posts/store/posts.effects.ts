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
import {SortOrder, State} from '~app/types/shared/shared.enums';
import {POST_FETCH_LIMIT} from '~app/constants/post';
import {ProfileTeasers} from '~app/types/profile/profile.interfaces';
import {hasLessMillisecondsThanDay} from '~app/utilities/date';
import {PostStatsService} from '~app/services/post-stats/post-stats.service';
import {LikePostMutationResult} from '~app/types/post-stats/post-stats.interfaces';
import {PostCommentsEffects} from '~app/modules/profile/modules/posts/store/comments/comments.effects';
import {PostRepliesEffects} from '~app/modules/profile/modules/posts/store/replies/replies.effects';

export const PostsEffects: Effects<PostsState> = {
  [PostsActions.createPost]: ({dispatch, payload, injector}: EffectOptions<PostsState, string>) => {
    const postService = injector.get(PostService);

    return postService
      .create({
        text: payload,
      })
      .pipe(
        tap(({data}: FetchResult<PostCreateMutationResult>) => {
          const dateService = injector.get(DateService);
          const translateService = injector.get(TranslateService);

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
        // TODO add failed deletion processing
        if (!data?.deletePost?.postDeletedCount) return;

        dispatch(PostsActions.removePost, payload);
      }),
    );
  },
  [PostsActions.likePost]: ({
    payload,
    dispatch,
    injector,
  }: EffectOptions<PostsState, {postId: string; like: State}>) => {
    const postStatsService = injector.get(PostStatsService);

    return postStatsService.like(payload).pipe(
      tap(({data}: FetchResult<LikePostMutationResult>) => {
        dispatch(PostsActions.setPostLike, {
          postId: payload.postId,
          like: data?.likePost?.like, // undefined is acceptible as well
        });
      }),
    );
  },
  [PostsActions.loadPosts]: ({
    dispatch,
    payload,
    injector,
  }: EffectOptions<
    PostsState,
    {
      resolvedUserId: string;
      skipProfileTeaserIds: Array<string>;
      offset: number;
      order?: SortOrder;
      limit?: number;
    }
  >) => {
    const postService = injector.get(PostService);

    return postService
      .getByUserId(payload.resolvedUserId, payload.skipProfileTeaserIds, {
        order: payload.order ?? SortOrder.DESCENDING,
        offset: payload.offset,
        limit: payload.limit ?? POST_FETCH_LIMIT,
      })
      .pipe(
        tap(({data}: ApolloQueryResult<PostsByUserIdQueryResult>) => {
          const translateService = injector.get(TranslateService);
          const dateService = injector.get(DateService);

          const profileTeasers: ProfileTeasers = {};
          const serverUtcTimestamp = dateService.serverUtcTimestamp;

          data.postsByUserId.userProfileTeasers.forEach((teaser) => {
            profileTeasers[teaser._id] = {
              // Where _profile/teaser _id is equal to user id
              avatarUrl: teaser.profile?.avatarUrl,
              username: teaser.username,
              isVerified: teaser.isVerified,
            };
          });

          const postCommentTotalCount: {[postId: string]: number} = {};
          const postCommentReplyTotalCount: {[postId: string]: number} = {};

          const posts = data.postsByUserId.posts.data.map((post) => {
            const newPost: Partial<UIPost> = {...post}; // TODO: consider to exclude totalComments & totalCommentsReplies from newPost

            postCommentTotalCount[post._id] = post.totalComments;
            postCommentReplyTotalCount[post._id] = post.totalCommentsReplies;

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

          dispatch(PostsActions.appendPosts, {
            posts,
            postCommentTotalCount,
            postCommentReplyTotalCount,
            postTotalCount: data.postsByUserId.posts.total,
          });
        }),
      );
  },
  ...PostCommentsEffects,
  ...PostRepliesEffects,
};
