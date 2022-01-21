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
import {
  PostCommentCreateMutationResult,
  PostCommentCreatePayload,
  PostCommentsByPostIdQueryResult,
  UIPostComment,
} from '~app/types/post-comment/post-comment.interfaces';
import {SortOrder} from '~app/types/shared/shared.enums';
import {POST_COMMENT_FETCH_LIMIT, POST_FETCH_LIMIT} from '~app/constants/post';
import {ProfileTeasers} from '~app/types/profile/profile.interfaces';
import {hasLessMillisecondsThanDay} from '~app/utilities/date';
import {ProfileActions} from '~app/modules/profile/store/profile.actions';
import {PostSubcommentService} from '~app/services/post-subcomment/post-subcomment.service';
import {
  PostSubcommentCreateMutationResult,
  PostSubcommentCreatePayload,
  PostSubcommentsByCommentIdQueryResult,
  UIPostSubcomment,
} from '~app/types/post-subcomment/post-subcomment.interfaces';

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
  [PostsActions.loadPostSubcomments]: ({
    dispatch,
    payload,
    injector,
  }: EffectOptions<
    PostsState,
    {
      commentId: string;
      recentlyAddedPostSubcommentIds: Array<string>;
      skipProfileTeaserIds: Array<string>;
      offset: number;
      order?: SortOrder;
      limit?: number;
    }
  >) => {
    const postSubcommentService = injector.get(PostSubcommentService);

    return postSubcommentService
      .getByCommentId(
        payload.commentId,
        payload.recentlyAddedPostSubcommentIds,
        payload.skipProfileTeaserIds,
        {
          order: payload.order ?? SortOrder.ASCENDING,
          offset: payload.offset - payload.recentlyAddedPostSubcommentIds.length,
          limit: payload.limit ?? POST_COMMENT_FETCH_LIMIT,
        },
      )
      .pipe(
        tap(({data}: FetchResult<PostSubcommentsByCommentIdQueryResult>) => {
          const translateService = injector.get(TranslateService);
          const dateService = injector.get(DateService);

          const serverUtcTimestamp = dateService.serverUtcTimestamp;

          const profileTeasers: ProfileTeasers = {};
          const postSubcomments = data?.postSubcommentsByCommentId.postSubcomments.data.map(
            (postSubcomment) => {
              const newPostSubcomment: Partial<UIPostSubcomment> = {...postSubcomment};

              newPostSubcomment.date = getPostFullDate(postSubcomment.createdAt, translateService);

              if (hasLessMillisecondsThanDay(serverUtcTimestamp - postSubcomment.createdAt)) {
                newPostSubcomment.timeElapsedAfterCreation$ = getTimeElapsedAfterCreation$({
                  createdAt: postSubcomment.createdAt,
                  dateService,
                  translateService,
                });

                return newPostSubcomment;
              }

              newPostSubcomment.timeElapsedAfterCreation$ = of(
                getPostShortDate({
                  createdAt: postSubcomment.createdAt,
                  serverUtcTimestamp: serverUtcTimestamp,
                  translateService,
                }),
              );

              return newPostSubcomment;
            },
          );
          // TODO update response model shape ??? object instead of array
          data?.postSubcommentsByCommentId.userProfileTeasers.forEach((profileTeaser) => {
            profileTeasers[profileTeaser._id] = {
              username: profileTeaser.username,
              avatarUrl: profileTeaser.profile.avatarUrl,
              isVerified: profileTeaser.isVerified,
            };
          });
          // const postComments = data.postCommentsByPostId.postComments;

          // TODO: consider merge into a single dispatch
          dispatch(ProfileActions.patchProfileTeasers, profileTeasers); // profileTeasers type mismatch
          dispatch(PostsActions.appendPostSubcomments, {
            commentId: payload.commentId,
            postSubcomments,
            postSubcommentTotalCount: data?.postSubcommentsByCommentId.postSubcomments.total,
          });
        }),
      );
  },
  [PostsActions.createPostSubcomment]: ({
    payload,
    dispatch,
    injector,
  }: EffectOptions<
    PostsState,
    {subcommentPayload: PostSubcommentCreatePayload; insertAtPosition: number}
  >) => {
    const postSubcommentService = injector.get(PostSubcommentService);

    return postSubcommentService.create(payload.subcommentPayload).pipe(
      tap(({data}: FetchResult<PostSubcommentCreateMutationResult>) => {
        const translateService = injector.get(TranslateService);
        const dateService = injector.get(DateService);

        const {createdAt} = data!.createPostSubcomment;

        const postSubcomment: Partial<UIPostSubcomment> = {
          ...data?.createPostSubcomment,
          date: getPostFullDate(createdAt, translateService),
          timeElapsedAfterCreation$: getTimeElapsedAfterCreation$({
            createdAt,
            translateService,
            dateService,
          }),
          isRecentlyAdded: true,
        };

        // console.log(data!.createPostSubcomment, postSubcomment);
        dispatch(PostsActions.insertPostSubcomment, {
          insertAtPosition: payload.insertAtPosition,
          postSubcomment,
          postId: payload.subcommentPayload.postId,
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
  [PostsActions.deletePostSubcomment]: ({
    payload,
    dispatch,
    injector,
  }: EffectOptions<PostsState, {postId: string; commentId: string; subcommentId: string}>) => {
    const postSubcommentService = injector.get(PostSubcommentService);

    return postSubcommentService.deleteById(payload.subcommentId).pipe(
      tap(({data}) => {
        // TODO add failed deletion processing
        if (!data?.deletePostSubcomment) return;

        dispatch(PostsActions.removePostSubcomment, payload);
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
          const postSubcommentTotalCount: {[commentId: string]: number} = {};

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
            const newPostComment: Partial<UIPostComment> = {...postComment}; // TODO: consider to exclude totalSubcomments from UIPostComment & newPostComment

            newPostComment.date = getPostFullDate(postComment.createdAt, translateService);

            postSubcommentTotalCount[postComment._id] = postComment.totalSubcomments;

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
            totalCommentsSubcomments: data.postCommentsByPostId.totalCommentsSubcomments,
            postSubcommentTotalCount,
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
          const postCommentSubcommentTotalCount: {[postId: string]: number} = {};

          const posts = data.postsByUserId.posts.data.map((post) => {
            const newPost: Partial<UIPost> = {...post}; // TODO: consider to exclude totalComments & totalCommentsSubcomments from newPost

            postCommentTotalCount[post._id] = post.totalComments;
            postCommentSubcommentTotalCount[post._id] = post.totalCommentsSubcomments;

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
            postCommentSubcommentTotalCount,
            postTotalCount: data.postsByUserId.posts.total,
          });
        }),
      );
  },
};
