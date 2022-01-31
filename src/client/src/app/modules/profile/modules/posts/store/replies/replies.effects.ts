import {PostsActions} from '~app/modules/profile/modules/posts/store/posts.actions';
import {EffectOptions, Effects} from '@ng-estate/store';
import {PostsState} from '~app/modules/profile/modules/posts/store';
import {SortOrder} from '~app/types/shared/shared.enums';
import {PostReplyService} from '~app/services/post-reply/post-reply.service';
import {POST_COMMENT_FETCH_LIMIT} from '~app/constants/post';
import {of, tap} from 'rxjs';
import {FetchResult} from '@apollo/client/core';
import {
  PostRepliesByCommentIdQueryResult,
  PostReplyCreateMutationResult,
  PostReplyCreatePayload,
  UIPostReply,
} from '~app/types/post-reply/post-reply.interfaces';
import {TranslateService} from '@ngx-translate/core';
import {DateService} from '~app/shared/services/date/date.service';
import {ProfileTeasers} from '~app/types/profile/profile.interfaces';
import {getPostFullDate, getPostShortDate, getTimeElapsedAfterCreation$} from '~app/utilities/post';
import {hasLessMillisecondsThanDay} from '~app/utilities/date';
import {ProfileActions} from '~app/modules/profile/store/profile.actions';

export const PostRepliesEffects: Effects<PostsState> = {
  [PostsActions.loadPostReplies]: ({
    dispatch,
    payload,
    injector,
  }: EffectOptions<
    PostsState,
    {
      commentId: string;
      recentlyAddedPostReplyIds: Array<string>;
      skipProfileTeaserIds: Array<string>;
      offset: number;
      order?: SortOrder;
      limit?: number;
    }
  >) => {
    const postReplyService = injector.get(PostReplyService);

    return postReplyService
      .getByCommentId(
        payload.commentId,
        payload.recentlyAddedPostReplyIds,
        payload.skipProfileTeaserIds,
        {
          order: payload.order ?? SortOrder.ASCENDING,
          offset: payload.offset - payload.recentlyAddedPostReplyIds.length,
          limit: payload.limit ?? POST_COMMENT_FETCH_LIMIT,
        },
      )
      .pipe(
        tap(({data}: FetchResult<PostRepliesByCommentIdQueryResult>) => {
          const translateService = injector.get(TranslateService);
          const dateService = injector.get(DateService);

          const serverUtcTimestamp = dateService.serverUtcTimestamp;

          const profileTeasers: ProfileTeasers = {};
          const postReplies = data?.postRepliesByCommentId.postReplies.data.map((postReply) => {
            const newPostReply: Partial<UIPostReply> = {...postReply};

            newPostReply.date = getPostFullDate(postReply.createdAt, translateService);

            if (hasLessMillisecondsThanDay(serverUtcTimestamp - postReply.createdAt)) {
              newPostReply.timeElapsedAfterCreation$ = getTimeElapsedAfterCreation$({
                createdAt: postReply.createdAt,
                dateService,
                translateService,
              });

              return newPostReply;
            }

            newPostReply.timeElapsedAfterCreation$ = of(
              getPostShortDate({
                createdAt: postReply.createdAt,
                serverUtcTimestamp: serverUtcTimestamp,
                translateService,
              }),
            );

            return newPostReply;
          });
          // TODO update response model shape ??? object instead of array
          data?.postRepliesByCommentId.userProfileTeasers.forEach((profileTeaser) => {
            profileTeasers[profileTeaser._id] = {
              username: profileTeaser.username,
              avatarUrl: profileTeaser.profile.avatarUrl,
              isVerified: profileTeaser.isVerified,
            };
          });
          // const postComments = data.postCommentsByPostId.postComments;

          // TODO: consider merge into a single dispatch
          dispatch(ProfileActions.patchProfileTeasers, profileTeasers); // profileTeasers type mismatch
          dispatch(PostsActions.appendPostReplies, {
            commentId: payload.commentId,
            postReplies,
            postReplyTotalCount: data?.postRepliesByCommentId.postReplies.total,
          });
        }),
      );
  },
  [PostsActions.createPostReply]: ({
    payload,
    dispatch,
    injector,
  }: EffectOptions<
    PostsState,
    {replyPayload: PostReplyCreatePayload; insertAtPosition: number}
  >) => {
    const postReplyService = injector.get(PostReplyService);

    return postReplyService.create(payload.replyPayload).pipe(
      tap(({data}: FetchResult<PostReplyCreateMutationResult>) => {
        const translateService = injector.get(TranslateService);
        const dateService = injector.get(DateService);

        const {createdAt} = data!.createPostReply;

        const postReply: Partial<UIPostReply> = {
          ...data?.createPostReply,
          date: getPostFullDate(createdAt, translateService),
          timeElapsedAfterCreation$: getTimeElapsedAfterCreation$({
            createdAt,
            translateService,
            dateService,
          }),
          isRecentlyAdded: true,
        };

        // console.log(data!.createPostReply, postReply);
        dispatch(PostsActions.insertPostReply, {
          insertAtPosition: payload.insertAtPosition,
          postReply,
          postId: payload.replyPayload.postId,
        });
      }),
    );
  },
  [PostsActions.deletePostReply]: ({
    payload,
    dispatch,
    injector,
  }: EffectOptions<PostsState, {postId: string; commentId: string; replyId: string}>) => {
    const postReplyService = injector.get(PostReplyService);

    return postReplyService.deleteById(payload.replyId).pipe(
      tap(({data}) => {
        // TODO add failed deletion processing
        if (!data?.deletePostReply) return;

        dispatch(PostsActions.removePostReply, payload);
      }),
    );
  },
};
