import {PostsActions} from '~app/modules/profile/modules/posts/store/posts.actions';
import {ReducerResult, Reducers} from '@ng-estate/store';
import {PostsState} from '~app/modules/profile/modules/posts/store/index';
import {UIPost} from '~app/types/post/post.interfaces';
import {State} from '~app/types/shared/shared.enums';
import {getLikeIncrement} from '~app/utilities/post';
import {PostCommentsReducers} from '~app/modules/profile/modules/posts/store/comments/comments.reducers';
import {PostRepliesReducers} from '~app/modules/profile/modules/posts/store/replies/replies.reducers';

export const PostsReducers: Reducers<PostsState> = {
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
  ...PostCommentsReducers,
  ...PostRepliesReducers,
};
