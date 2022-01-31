import {EffectOptions, Effects} from '@ng-estate/store';
import {PostsState} from '~app/modules/profile/modules/posts/store';
import {SortOrder, State} from '~app/types/shared/shared.enums';
import {PostCommentStatsService} from '~app/services/post-comment-stats/post-comment-stats.service';
import {of, tap} from 'rxjs';
import {ApolloQueryResult, FetchResult} from '@apollo/client/core';
import {LikePostCommentMutationResult} from '~app/types/post-comment-stats/post-comment-stats.interfaces';
import {PostCommentService} from '~app/services/post-comment/post-comment.service';
import {
  PostCommentCreateMutationResult,
  PostCommentCreatePayload,
  PostCommentsByPostIdQueryResult,
  UIPostComment,
} from '~app/types/post-comment/post-comment.interfaces';
import {TranslateService} from '@ngx-translate/core';
import {DateService} from '~app/shared/services/date/date.service';
import {getPostFullDate, getPostShortDate, getTimeElapsedAfterCreation$} from '~app/utilities/post';
import {POST_COMMENT_FETCH_LIMIT} from '~app/constants/post';
import {ProfileTeasers} from '~app/types/profile/profile.interfaces';
import {hasLessMillisecondsThanDay} from '~app/utilities/date';
import {ProfileActions} from '~app/modules/profile/store/profile.actions';
import {PostsActions} from '~app/modules/profile/modules/posts/store/posts.actions';

export const PostCommentsEffects: Effects<PostsState> = {
  [PostsActions.likePostComment]: ({
    payload,
    dispatch,
    injector,
  }: EffectOptions<PostsState, {postId: string; commentId: string; like: State}>) => {
    const postCommentStatsService = injector.get(PostCommentStatsService);

    return postCommentStatsService.like({commentId: payload.commentId, like: payload.like}).pipe(
      tap(({data}: FetchResult<LikePostCommentMutationResult>) => {
        dispatch(PostsActions.setPostCommentLike, {
          postId: payload.postId,
          commentId: payload.commentId,
          like: data?.likePostComment?.like, // undefined is acceptible as well
        });
      }),
    );
  },
  [PostsActions.deletePostComment]: ({
    payload,
    dispatch,
    injector,
  }: EffectOptions<PostsState, {postId: string; commentId: string}>) => {
    const postCommentService = injector.get(PostCommentService);

    return postCommentService.deleteByCommentId(payload.commentId).pipe(
      tap(({data}) => {
        // TODO add failed deletion processing
        if (!data?.deletePostComment?.commentDeletedCount) return;

        dispatch(PostsActions.removeCommentRelatedData, {
          ...data.deletePostComment,
          commentId: payload.commentId,
          postId: payload.postId,
        });
      }),
    );
  },
  [PostsActions.createPostComment]: ({
    payload,
    dispatch,
    injector,
  }: EffectOptions<PostsState, PostCommentCreatePayload>) => {
    const postCommentService = injector.get(PostCommentService);

    return postCommentService.create(payload).pipe(
      // TODO...
      tap(({data}: FetchResult<PostCommentCreateMutationResult>) => {
        const translateService = injector.get(TranslateService);
        const dateService = injector.get(DateService);

        const {createdAt} = data!.createPostComment;

        const postComment: Partial<UIPostComment> = {
          ...data?.createPostComment,
          date: getPostFullDate(createdAt, translateService),
          timeElapsedAfterCreation$: getTimeElapsedAfterCreation$({
            createdAt,
            translateService,
            dateService,
          }),
          isRecentlyAdded: true,
          // hasToBeSkippedByApi: true,
        };

        // console.log('postComment ', postComment);

        dispatch(PostsActions.prependPostComment, postComment);
      }),
    );
  },
  [PostsActions.loadPostComments]: ({
    payload,
    dispatch,
    injector,
  }: EffectOptions<
    PostsState,
    {
      // TODO pass a list of postComments to find those which were added recently & have to be skipped during data.postCommentsByPostId.postComments.data.map() in order to avoid duplicate entry
      postId: string;
      recentlyAddedPostCommentIds: Array<string>;
      skipProfileTeaserIds: Array<string>;
      offset: number;
      order?: SortOrder;
      limit?: number;
    }
  >) => {
    const postCommentService = injector.get(PostCommentService);

    return postCommentService
      .getByPostId(
        payload.postId,
        payload.recentlyAddedPostCommentIds,
        payload.skipProfileTeaserIds,
        {
          order: payload.order ?? SortOrder.ASCENDING,
          offset: payload.offset - payload.recentlyAddedPostCommentIds.length,
          limit: payload.limit ?? POST_COMMENT_FETCH_LIMIT,
        },
      )
      .pipe(
        tap(({data}: ApolloQueryResult<PostCommentsByPostIdQueryResult>) => {
          // console.log('here ', data);
          const translateService = injector.get(TranslateService);
          const dateService = injector.get(DateService);

          const serverUtcTimestamp = dateService.serverUtcTimestamp;

          const profileTeasers: ProfileTeasers = {};
          const postReplyTotalCount: {[commentId: string]: number} = {};

          // const uniquePostComments = payload.recentlyAddedPostComments.length
          //   ? data.postCommentsByPostId.postComments.data.filter(
          //       (postComment) =>
          //         payload.recentlyAddedPostComments.findIndex(
          //           (recentPostComment) => recentPostComment._id === postComment._id,
          //         ) === -1,
          //     )
          //   : data.postCommentsByPostId.postComments.data;

          // console.log(data.postCommentsByPostId.postComments.data, uniquePostComments);

          const postComments = data.postCommentsByPostId.postComments.data.map((postComment) => {
            const newPostComment: Partial<UIPostComment> = {...postComment}; // TODO: consider to exclude totalReplies from UIPostComment & newPostComment

            newPostComment.date = getPostFullDate(postComment.createdAt, translateService);

            postReplyTotalCount[postComment._id] = postComment.totalReplies;

            if (hasLessMillisecondsThanDay(serverUtcTimestamp - postComment.createdAt)) {
              newPostComment.timeElapsedAfterCreation$ = getTimeElapsedAfterCreation$({
                createdAt: postComment.createdAt,
                dateService,
                translateService,
              });

              return newPostComment;
            }

            newPostComment.timeElapsedAfterCreation$ = of(
              getPostShortDate({
                createdAt: postComment.createdAt,
                serverUtcTimestamp: serverUtcTimestamp,
                translateService,
              }),
            );

            return newPostComment;
          });
          // TODO update response model shape ??? object instead of array
          data.postCommentsByPostId.userProfileTeasers.forEach((profileTeaser) => {
            profileTeasers[profileTeaser._id] = {
              username: profileTeaser.username,
              avatarUrl: profileTeaser.profile.avatarUrl,
              isVerified: profileTeaser.isVerified,
            };
          });
          // const postComments = data.postCommentsByPostId.postComments;

          // TODO: consider merge into a single dispatch
          dispatch(ProfileActions.patchProfileTeasers, profileTeasers); // profileTeasers type mismatch
          dispatch(PostsActions.appendPostComments, {
            postId: payload.postId,
            postComments,
            postCommentTotalCount: data.postCommentsByPostId.postComments.total,
            totalCommentsReplies: data.postCommentsByPostId.totalCommentsReplies,
            postReplyTotalCount,
          });
        }),
      );
  },
};
