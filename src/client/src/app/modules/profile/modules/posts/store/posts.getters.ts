import {Getters} from '@ng-estate/store';
import {PostsState} from '~app/modules/profile/modules/posts/store/index';
import {PostsSelectors} from '~app/modules/profile/modules/posts/store/posts.selectors';

export const PostsGetters: Getters<PostsState> = {
  [PostsSelectors.getPosts]: (state) => state.posts,
  [PostsSelectors.getPostCommentsByPostId]: (state, payload: string) => state.postComments[payload],
  [PostsSelectors.getPostRepliesByCommentId]: (state, payload: string) =>
    state.postReplies[payload],
  // [PostsSelectors.getPostCount]: (state) => state.posts.length,
  [PostsSelectors.getPostTotalCount]: (state) => state.postTotalCount,
  [PostsSelectors.getIsLoadingPosts]: (state) => state.isLoadingPosts,
  [PostsSelectors.getIsLoadingPostComments]: (state) => state.isLoadingPostComments,
  [PostsSelectors.getIsLoadingPostReplies]: (state) => state.isLoadingPostReplies,
  [PostsSelectors.getPostCommentCount]: (state, postId: string) =>
    state.postComments[postId]?.length ?? 0,
  [PostsSelectors.getPostReplyCount]: (state, commentId: string) =>
    state.postReplies[commentId]?.length ?? 0,
  [PostsSelectors.getPostCommentTotalCount]: (state, postId: string) =>
    state.postCommentTotalCount[postId],
  [PostsSelectors.getPostReplyTotalCount]: (state, commentId: string) =>
    state.postReplyTotalCount[commentId],
  // [PostsSelectors.getPostRepliesTotalCount]: (state) => state.postReplyTotalCount,
  [PostsSelectors.getPostCommentReplyTotalCount]: (state, postId: string) => {
    return state.postCommentReplyTotalCount[postId];
  },
  // [PostsSelectors.getVisiblePostComments]: (state) => state.visiblePostComments,
};
