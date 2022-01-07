import {PostsActions} from '~app/modules/profile/modules/posts/store/posts.actions';
import {ReducerResult, Reducers} from '@ng-estate/store';
import {PostsState} from '~app/modules/profile/modules/posts/store/index';
import {UIPost} from '~app/types/post/post.interfaces';
import {UIPostComment} from '~app/types/post-comment/post-comment.interfaces';
import {UIPostSubcomment} from '~app/types/post-subcomment/post-subcomment.interfaces';
import {immutableInsertAt} from '~app/utilities/array';

export const PostsReducers: Reducers<PostsState> = {
  [PostsActions.loadPostSubcomments]: (state) => ({
    ...state,
    isLoadingPostSubcomments: true,
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
    // let other linked entities such as comments and subcomments to leave in a ghost mode in memory
  }),
  [PostsActions.removeCommentRelatedData]: (
    state,
    {
      postId,
      commentId,
      commentDeletedCount,
      subcommentDeletedCount,
    }: {
      postId: string;
      commentId: string;
      commentDeletedCount: number;
      subcommentDeletedCount: number;
    },
  ): ReducerResult<PostsState> => {
    return {
      ...state,
      postComments: {
        ...state.postComments,
        [postId]: state.postComments[postId].filter((comment) => comment._id !== commentId),
      },
      // postSubcomments: {...state.postSubcomments, [commentId]: []},
      postCommentSubcommentTotalCount: {
        ...state.postCommentSubcommentTotalCount,
        [postId]:
          state.postCommentSubcommentTotalCount[postId] -
          (commentDeletedCount + subcommentDeletedCount),
      },
      postCommentTotalCount: {
        ...state.postCommentTotalCount,
        [postId]: state.postCommentTotalCount[postId] - commentDeletedCount,
      },
      // let subcomments to leave in a ghost mode in memory
      // postSubcommentTotalCount: {
      //   ...state.postSubcommentTotalCount,
      //   [commentId]: 0,
      // },
    };
  },
  [PostsActions.insertPostSubcomment]: (
    state,
    {
      insertAtPosition,
      postSubcomment,
      postId,
    }: {
      insertAtPosition: number;
      postSubcomment: UIPostSubcomment;
      postId: string;
    },
  ): ReducerResult<PostsState> => ({
    // TODO
    ...state,
    postCommentSubcommentTotalCount: {
      ...state.postCommentSubcommentTotalCount,
      [postId]: state.postCommentSubcommentTotalCount[postId] + 1,
    },
    postSubcomments: {
      ...state.postSubcomments,
      // [payload.postSubcomment.commentId]: [payload, ...(state.postComments[payload.postId] ?? [])],
      [postSubcomment.commentId]: state.postSubcomments[postSubcomment.commentId]
        ? immutableInsertAt(
            state.postSubcomments[postSubcomment.commentId] ?? [],
            insertAtPosition,
            postSubcomment,
          )
        : [postSubcomment],
    },
    postSubcommentTotalCount: {
      ...state.postSubcommentTotalCount,
      [postSubcomment.commentId]:
        (state.postSubcommentTotalCount[postSubcomment.commentId] ?? 0) + 1,
    },
  }),
  [PostsActions.appendPostSubcomments]: (
    state,
    payload: {
      commentId: string;
      postSubcomments: Array<UIPostSubcomment>;
      postSubcommentTotalCount: number;
    },
  ): ReducerResult<PostsState> => ({
    // TODO
    ...state,
    postSubcomments: {
      ...state.postSubcomments,
      [payload.commentId]: state.postSubcomments[payload.commentId]
        ? [...state.postSubcomments[payload.commentId], ...payload.postSubcomments]
        : payload.postSubcomments,
    },
    postSubcommentTotalCount: {
      ...state.postCommentTotalCount,
      [payload.commentId]: payload.postSubcommentTotalCount,
    },
    isLoadingPostSubcomments: false,
  }),
  // [PostsActions.setPostCmmentSubcommentTotalCount]: (
  //   state,
  //   {
  //     postId,
  //     commentSubcommentTotalCount,
  //   }: {
  //     postId: string;
  //     commentSubcommentTotalCount: number;
  //   },
  // ): ReducerResult<PostsState> => ({
  //   ...state,
  //   postCommentSubcommentTotalCount: {
  //     ...state.postCommentSubcommentTotalCount,
  //     [postId]: commentSubcommentTotalCount,
  //   },
  // }),
  [PostsActions.appendPosts]: (
    state,
    {
      posts,
      postCommentSubcommentTotalCount,
      postCommentTotalCount,
      postTotalCount,
    }: {
      posts: Array<UIPost>;
      postCommentSubcommentTotalCount: {[postId: string]: number};
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
    postCommentSubcommentTotalCount: {
      ...state.postCommentSubcommentTotalCount,
      ...postCommentSubcommentTotalCount,
    },
    isLoadingPosts: false,
  }),
  [PostsActions.prependPostComment]: (
    state,
    payload: UIPostComment,
  ): ReducerResult<PostsState> => ({
    ...state,
    postCommentSubcommentTotalCount: {
      ...state.postCommentSubcommentTotalCount,
      [payload.postId]: state.postCommentSubcommentTotalCount[payload.postId] + 1,
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
  [PostsActions.appendPostComments]: (
    state,
    payload: {
      postId: string;
      postComments: Array<UIPostComment>;
      postCommentTotalCount: number;
      totalCommentsSubcomments: number;
      postSubcommentTotalCount: {[commentId: string]: number};
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
      postCommentTotalCount: {
        ...state.postCommentTotalCount,
        [payload.postId]: payload.postCommentTotalCount,
      },
      postSubcommentTotalCount: {
        ...state.postSubcommentTotalCount,
        ...payload.postSubcommentTotalCount,
      },
      isLoadingPostComments: false,
    };

    if (payload.totalCommentsSubcomments !== null) {
      // If it's a first-most comment load, update comments & subcomments total count
      nextState.postCommentSubcommentTotalCount = {
        ...state.postCommentSubcommentTotalCount,
        [payload.postId]: payload.totalCommentsSubcomments,
      };
    }

    return nextState;
  },
  [PostsActions.removeCommentThread]: (state, postId: string) => ({
    ...state,
    postComments: {
      ...state.postComments,
      // [payload._id]: payload
      [postId]: [], // TODO Consider reset subcomments as well
    },
  }),
  [PostsActions.removeSubcommentThread]: (state, commentId: string) => ({
    ...state,
    postSubcomments: {
      ...state.postSubcomments,
      // [payload._id]: payload
      [commentId]: [], // TODO Consider reset subcomments as well
    },
  }),
};
