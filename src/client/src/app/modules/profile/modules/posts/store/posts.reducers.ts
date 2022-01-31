import {PostsActions} from '~app/modules/profile/modules/posts/store/posts.actions';
import {ReducerResult, Reducers} from '@ng-estate/store';
import {PostsState} from '~app/modules/profile/modules/posts/store/index';
import {UIPost} from '~app/types/post/post.interfaces';
import {UIPostComment} from '~app/types/post-comment/post-comment.interfaces';
import {UIPostReply} from '~app/types/post-reply/post-reply.interfaces';
import {immutableInsertAt} from '~app/utilities/array';
import {State} from '~app/types/shared/shared.enums';
import {getLikeIncrement} from '~app/utilities/post';

export const PostsReducers: Reducers<PostsState> = {
  [PostsActions.loadPostReplies]: (state) => ({
    ...state,
    isLoadingPostReplies: true,
  }),
  [PostsActions.loadPostComments]: (state) => ({
    ...state,
    isLoadingPostComments: true,
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
  [PostsActions.removeReplyThread]: (state, commentId: string) => ({
    ...state,
    postReplies: {
      ...state.postReplies,
      // [payload._id]: payload
      [commentId]: [],
    },
  }),
};
