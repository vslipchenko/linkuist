import {Getters} from '@ng-estate/store';
import {PostsState} from '~app/modules/profile/modules/posts/store/index';
import {PostsSelectors} from '~app/modules/profile/modules/posts/store/posts.selectors';
import {PostCommentsGetters} from '~app/modules/profile/modules/posts/store/comments/comments.getters';

export const PostsGetters: Getters<PostsState> = {
  [PostsSelectors.getPosts]: (state) => state.posts,

  [PostsSelectors.getPostRepliesByCommentId]: (state, payload: string) =>
    state.postReplies[payload],
  // [PostsSelectors.getPostCount]: (state) => state.posts.length,
  [PostsSelectors.getPostTotalCount]: (state) => state.postTotalCount,
  [PostsSelectors.getIsLoadingPosts]: (state) => state.isLoadingPosts,
  [PostsSelectors.getIsLoadingPostReplies]: (state) => state.isLoadingPostReplies,
  [PostsSelectors.getPostReplyCount]: (state, commentId: string) =>
    state.postReplies[commentId]?.length ?? 0,

  [PostsSelectors.getPostReplyTotalCount]: (state, commentId: string) =>
    state.postReplyTotalCount[commentId],
  // [PostsSelectors.getPostRepliesTotalCount]: (state) => state.postReplyTotalCount,
  [PostsSelectors.getPostCommentReplyTotalCount]: (state, postId: string) => {
    return state.postCommentReplyTotalCount[postId];
  },
  ...PostCommentsGetters,
  // [PostsSelectors.getVisiblePostComments]: (state) => state.visiblePostComments,
};
