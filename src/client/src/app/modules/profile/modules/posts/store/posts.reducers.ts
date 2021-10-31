import {PostsActions} from '~app/modules/profile/modules/posts/store/posts.actions';
import {ReducerResult, Reducers} from '@ng-estate/store';
import {PostsState} from '~app/modules/profile/modules/posts/store/index';
import {UIPost} from '~app/types/post/post.interfaces';
import {PostComment} from '~app/types/post-comment/post-comment.interfaces';

export const PostsReducers: Reducers<PostsState> = {
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
  [PostsActions.appendPostComments]: (
    state,
    payload: {postId: string; postComments: Array<PostComment>; postCommentTotalCount: number},
  ): ReducerResult<PostsState> => ({
    ...state,
    postComments: {
      ...state.postComments,
      // [payload._id]: payload
      [payload.postId]: [...(state.postComments[payload.postId] ?? []), ...payload.postComments],
    },
    postCommentTotalCount: {
      ...state.postCommentTotalCount,
      [payload.postId]: payload.postCommentTotalCount,
    },
    isLoadingPostComments: false,
  }),
};
