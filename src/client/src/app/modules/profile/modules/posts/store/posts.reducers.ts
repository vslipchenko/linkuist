import {PostsActions} from '~app/modules/profile/modules/posts/store/posts.actions';
import {ReducerResult, Reducers} from '@ng-estate/store';
import {PostsState} from '~app/modules/profile/modules/posts/store/index';
import {UIPost} from '~app/types/post/post.interfaces';
import {UIPostReply} from '~app/types/post-reply/post-reply.interfaces';
import {immutableInsertAt} from '~app/utilities/array';
import {State} from '~app/types/shared/shared.enums';
import {getLikeIncrement} from '~app/utilities/post';
import {PostCommentsReducers} from '~app/modules/profile/modules/posts/store/comments/comments.reducers';

export const PostsReducers: Reducers<PostsState> = {
  [PostsActions.loadPostReplies]: (state) => ({
    ...state,
    isLoadingPostReplies: true,
  }),
  [PostsActions.loadPosts]: (state) => ({
    ...state,
    isLoadingPosts: true,
  }),
  [PostsActions.prependPost]: (state, newPost: UIPost): ReducerResult<PostsState> => ({
    ...state,
    posts: [newPost, ...state.posts],
    postTotalCount: state.postTotalCount + 1,
  }),
  [PostsActions.removePost]: (state, postId: string): ReducerResult<PostsState> => ({
    ...state,
    posts: state.posts.filter((post) => post._id !== postId),
    postTotalCount: state.postTotalCount - 1,
    // let other linked entities such as comments and replies stay in memory
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
  // [PostsActions.setPostCmmentReplyTotalCount]: (
  //   state,
  //   {
  //     postId,
  //     commentReplyTotalCount,
  //   }: {
  //     postId: string;
  //     commentReplyTotalCount: number;
  //   },
  // ): ReducerResult<PostsState> => ({
  //   ...state,
  //   postCommentReplyTotalCount: {
  //     ...state.postCommentReplyTotalCount,
  //     [postId]: commentReplyTotalCount,
  //   },
  // }),
  [PostsActions.appendPosts]: (
    state,
    {
      posts,
      postCommentReplyTotalCount,
      postCommentTotalCount,
      postTotalCount,
    }: {
      posts: Array<UIPost>;
      postCommentReplyTotalCount: {[postId: string]: number};
      postCommentTotalCount: {[postId: string]: number};
      postTotalCount: number;
    },
  ): ReducerResult<PostsState> => ({
    ...state,
    posts: [...state.posts, ...posts],
    postTotalCount: postTotalCount,
    postCommentTotalCount: {
      ...state.postCommentTotalCount,
      ...postCommentTotalCount,
    },
    postCommentReplyTotalCount: {
      ...state.postCommentReplyTotalCount,
      ...postCommentReplyTotalCount,
    },
    isLoadingPosts: false,
  }),
  [PostsActions.setPostLike]: (
    state,
    payload: {postId: string; like: State},
  ): ReducerResult<PostsState> => ({
    ...state,
    posts: state.posts.map((post) => {
      if (post._id === payload.postId) {
        const increment = getLikeIncrement(post.like, payload.like);
        const totalLikes = post.totalLikes + increment.like;
        const totalDislikes = post.totalDislikes + increment.dislike;

        return {
          ...post,
          totalLikes,
          totalDislikes,
          like: payload.like,
        };
      }

      return post;
    }),
  }),
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
  ...PostCommentsReducers,
};
