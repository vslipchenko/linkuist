import {PostsActions} from '~app/modules/profile/modules/posts/store/posts.actions';
import {ReducerResult, Reducers} from '@ng-estate/store';
import {PostsState} from '~app/modules/profile/modules/posts/store/index';
import {UIPost} from '~app/types/post/post.interfaces';
import {UIPostComment} from '~app/types/post-comment/post-comment.interfaces';
import {UIPostSubcomment} from '~app/types/post-subcomment/post-subcomment.interfaces';

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
  [PostsActions.removePost]: (state, _id: string): ReducerResult<PostsState> => ({
    ...state,
    posts: state.posts.filter((post) => post._id !== _id),
    postTotalCount: state.postTotalCount - 1,
  }),
  [PostsActions.insertPostSubcomment]: (state, payload) => ({
    // TODO
    ...state,
  }),
  [PostsActions.appendPostSubcomments]: (
    state,
    payload: {
      commentId: string;
      postSubcomments: Array<UIPostSubcomment>;
      postSubcommentTotalCount: number;
    },
  ) => ({
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
  [PostsActions.appendPosts]: (
    state,
    {
      posts,
      postCommentTotalCount,
      postTotalCount,
    }: {
      posts: Array<UIPost>;
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
    isLoadingPosts: false,
  }),
  [PostsActions.prependPostComment]: (
    state,
    payload: UIPostComment,
  ): ReducerResult<PostsState> => ({
    ...state,
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
      postSubcommentTotalCount: {[commentId: string]: number};
    },
  ): ReducerResult<PostsState> => ({
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
    // TODO Update postSubcommentTotalCount ??? Doubtful
    postSubcommentTotalCount: {
      ...state.postSubcommentTotalCount,
      ...payload.postSubcommentTotalCount,
    },
    isLoadingPostComments: false,
  }),
  [PostsActions.removeCommentThread]: (state, postId: string) => ({
    ...state,
    postComments: {
      ...state.postComments,
      // [payload._id]: payload
      [postId]: [], // TODO Consider reset subcomments as well
    },
  }),
};
