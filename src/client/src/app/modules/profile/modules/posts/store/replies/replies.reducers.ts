import {ReducerResult, Reducers} from '@ng-estate/store';
import {PostsState} from '~app/modules/profile/modules/posts/store';
import {PostsActions} from '~app/modules/profile/modules/posts/store/posts.actions';
import {UIPostReply} from '~app/types/post-reply/post-reply.interfaces';
import {immutableInsertAt} from '~app/utilities/array';

export const PostRepliesReducers: Reducers<PostsState> = {
  [PostsActions.loadPostReplies]: (state) => ({
    ...state,
    isLoadingPostReplies: true,
  }),
  [PostsActions.insertPostReply]: (
    state,
    {
      insertAtPosition,
      postReply,
      postId,
    }: {
      insertAtPosition: number;
      postReply: UIPostReply;
      postId: string;
    },
  ): ReducerResult<PostsState> => ({
    // TODO
    ...state,
    postCommentReplyTotalCount: {
      ...state.postCommentReplyTotalCount,
      [postId]: state.postCommentReplyTotalCount[postId] + 1,
    },
    postReplies: {
      ...state.postReplies,
      // [payload.postReply.commentId]: [payload, ...(state.postComments[payload.postId] ?? [])],
      [postReply.commentId]: state.postReplies[postReply.commentId]
        ? immutableInsertAt(
            state.postReplies[postReply.commentId] ?? [],
            insertAtPosition,
            postReply,
          )
        : [postReply],
    },
    postReplyTotalCount: {
      ...state.postReplyTotalCount,
      [postReply.commentId]: (state.postReplyTotalCount[postReply.commentId] ?? 0) + 1,
    },
  }),
  [PostsActions.appendPostReplies]: (
    state,
    payload: {
      commentId: string;
      postReplies: Array<UIPostReply>;
      postReplyTotalCount: number;
    },
  ): ReducerResult<PostsState> => {
    const nextState = {
      ...state,
      postReplies: {
        ...state.postReplies,
        [payload.commentId]: state.postReplies[payload.commentId]
          ? [...state.postReplies[payload.commentId], ...payload.postReplies]
          : payload.postReplies,
      },
      isLoadingPostReplies: false,
    };

    if (payload.postReplyTotalCount !== null) {
      // If it's a first-most reply load, update reply total count
      nextState.postReplyTotalCount = {
        ...state.postCommentTotalCount,
        [payload.commentId]: payload.postReplyTotalCount,
      };
    }

    return nextState;
  },
  [PostsActions.removePostReply]: (
    state,
    {postId, commentId, replyId}: {postId: string; commentId: string; replyId: string},
  ) => ({
    ...state,
    postCommentReplyTotalCount: {
      ...state.postCommentReplyTotalCount,
      [postId]: state.postCommentReplyTotalCount[postId] - 1,
    },
    postReplyTotalCount: {
      ...state.postReplyTotalCount,
      [commentId]: state.postReplyTotalCount[commentId] - 1,
    },
    postReplies: {
      ...state.postReplies,
      [commentId]: state.postReplies[commentId].filter((reply) => reply._id !== replyId),
    },
  }),
  [PostsActions.removeReplyThread]: (state, commentId: string) => ({
    ...state,
    postReplies: {
      ...state.postReplies,
      // [payload._id]: payload
      [commentId]: [],
    },
  }),
};
