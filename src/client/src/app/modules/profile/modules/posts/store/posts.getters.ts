import {Getters} from '@ng-estate/store';
import {PostsState} from '~app/modules/profile/modules/posts/store/index';
import {PostsSelectors} from '~app/modules/profile/modules/posts/store/posts.selectors';

export const PostsGetters: Getters<PostsState> = {
  [PostsSelectors.getPosts]: (state) => state.posts,
  [PostsSelectors.getPostCommentsByPostId]: (state, payload: string) => state.postComments[payload],
  [PostsSelectors.getPostSubcommentsByCommentId]: (state, payload: string) =>
    state.postSubcomments[payload],
  // [PostsSelectors.getPostCount]: (state) => state.posts.length,
  [PostsSelectors.getPostTotalCount]: (state) => state.postTotalCount,
  [PostsSelectors.getIsLoadingPosts]: (state) => state.isLoadingPosts,
  [PostsSelectors.getIsLoadingPostComments]: (state) => state.isLoadingPostComments,
  [PostsSelectors.getIsLoadingPostSubcomments]: (state) => state.isLoadingPostSubcomments,
  [PostsSelectors.getPostCommentCount]: (state, postId: string) =>
    state.postComments[postId]?.length ?? 0,
  [PostsSelectors.getPostSubcommentCount]: (state, commentId: string) =>
    state.postSubcomments[commentId]?.length ?? 0,
  [PostsSelectors.getPostCommentTotalCount]: (state, postId: string) =>
    state.postCommentTotalCount[postId],
  [PostsSelectors.getPostSubcommentTotalCount]: (state, commentId: string) =>
    state.postSubcommentTotalCount[commentId],
  // [PostsSelectors.getPostSubcommentsTotalCount]: (state) => state.postSubcommentTotalCount,
  [PostsSelectors.getPostCommentSubcommentTotalCount]: (state, postId: string) => {
    return state.postCommentSubcommentTotalCount[postId];
  },
  // [PostsSelectors.getVisiblePostComments]: (state) => state.visiblePostComments,
};
