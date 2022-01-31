import {ReducerResult, Reducers} from '@ng-estate/store';
import {PostsState} from '~app/modules/profile/modules/posts/store';
import {UIPostComment} from '~app/types/post-comment/post-comment.interfaces';
import {State} from '~app/types/shared/shared.enums';
import {getLikeIncrement} from '~app/utilities/post';
import {PostsActions} from '~app/modules/profile/modules/posts/store/posts.actions';

export const PostCommentsReducers: Reducers<PostsState> = {
  [PostsActions.loadPostComments]: (state) => ({
    ...state,
    isLoadingPostComments: true,
  }),
  [PostsActions.removeCommentRelatedData]: (
    state,
    {
      postId,
      commentId,
      commentDeletedCount,
      replyDeletedCount,
    }: {
      postId: string;
      commentId: string;
      commentDeletedCount: number;
      replyDeletedCount: number;
    },
  ): ReducerResult<PostsState> => {
    return {
      ...state,
      postComments: {
        ...state.postComments,
        [postId]: state.postComments[postId].filter((comment) => comment._id !== commentId),
      },
      // postReplies: {...state.postReplies, [commentId]: []},
      postCommentReplyTotalCount: {
        ...state.postCommentReplyTotalCount,
        [postId]:
          state.postCommentReplyTotalCount[postId] - (commentDeletedCount + replyDeletedCount),
      },
      postCommentTotalCount: {
        ...state.postCommentTotalCount,
        [postId]: state.postCommentTotalCount[postId] - commentDeletedCount,
      },
      // let replies to leave in a ghost mode in memory
      // postReplyTotalCount: {
      //   ...state.postReplyTotalCount,
      //   [commentId]: 0,
      // },
    };
  },
  [PostsActions.prependPostComment]: (
    state,
    payload: UIPostComment,
  ): ReducerResult<PostsState> => ({
    ...state,
    postCommentReplyTotalCount: {
      ...state.postCommentReplyTotalCount,
      [payload.postId]: state.postCommentReplyTotalCount[payload.postId] + 1,
    },
    postComments: {
      ...state.postComments,
      [payload.postId]: [payload, ...(state.postComments[payload.postId] ?? [])],
    },
    postCommentTotalCount: {
      ...state.postCommentTotalCount,
      [payload.postId]: state.postCommentTotalCount[payload.postId] + 1,
    },
  }),
  [PostsActions.setPostCommentLike]: (
    state,
    payload: {postId: string; commentId: string; like: State},
  ): ReducerResult<PostsState> => ({
    ...state,
    postComments: {
      ...state.postComments,
      [payload.postId]: state.postComments[payload.postId].map((comment) => {
        if (payload.commentId === comment._id) {
          const increment = getLikeIncrement(comment.like, payload.like);
          const totalLikes = comment.totalLikes + increment.like;
          const totalDislikes = comment.totalDislikes + increment.dislike;

          return {
            ...comment,
            totalLikes,
            totalDislikes,
            like: payload.like,
          };
        }

        return comment;
      }),
    },
  }),
  [PostsActions.appendPostComments]: (
    state,
    payload: {
      postId: string;
      postComments: Array<UIPostComment>;
      postCommentTotalCount: number;
      totalCommentsReplies: number;
      postReplyTotalCount: {[commentId: string]: number};
    },
  ): ReducerResult<PostsState> => {
    const nextState = {
      ...state,
      postComments: {
        ...state.postComments,
        // [payload._id]: payload
        [payload.postId]: state.postComments[payload.postId]
          ? [...state.postComments[payload.postId], ...payload.postComments]
          : payload.postComments,
      },
      postReplyTotalCount: {
        ...state.postReplyTotalCount,
        ...payload.postReplyTotalCount,
      },
      isLoadingPostComments: false,
    };

    if (payload.postCommentTotalCount !== null) {
      // If it's a first-most comment load, update comment total count
      nextState.postCommentTotalCount = {
        ...state.postCommentTotalCount,
        [payload.postId]: payload.postCommentTotalCount,
      };
    }

    if (payload.totalCommentsReplies !== null) {
      // If it's a first-most comment load, update comments & replies total count
      nextState.postCommentReplyTotalCount = {
        ...state.postCommentReplyTotalCount,
        [payload.postId]: payload.totalCommentsReplies,
      };
    }

    return nextState;
  },
  [PostsActions.removeCommentThread]: (state, postId: string) => {
    const postReplies = {
      ...state.postReplies,
    };

    state.postComments[postId].forEach((comment) => {
      if (postReplies[comment._id]) postReplies[comment._id] = [];
    });

    return {
      ...state,
      postComments: {
        ...state.postComments,
        // [payload._id]: payload
        [postId]: [],
      },
      postReplies,
    };
  },
};
