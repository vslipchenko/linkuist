import {Getters} from '@ng-estate/store';
import {PostsState} from '~app/modules/profile/modules/posts/store/index';
import {PostsSelectors} from '~app/modules/profile/modules/posts/store/posts.selectors';
import {PostCommentsGetters} from '~app/modules/profile/modules/posts/store/comments/comments.getters';
import {PostRepliesGetters} from '~app/modules/profile/modules/posts/store/replies/replies.getters';

export const PostsGetters: Getters<PostsState> = {
  [PostsSelectors.getPosts]: (state) => state.posts,

  // [PostsSelectors.getPostCount]: (state) => state.posts.length,
  [PostsSelectors.getPostTotalCount]: (state) => state.postTotalCount,
  [PostsSelectors.getIsLoadingPosts]: (state) => state.isLoadingPosts,

  // [PostsSelectors.getPostRepliesTotalCount]: (state) => state.postReplyTotalCount,
  [PostsSelectors.getPostCommentReplyTotalCount]: (state, postId: string) => {
    return state.postCommentReplyTotalCount[postId];
  },
  ...PostCommentsGetters,
  ...PostRepliesGetters,
  // [PostsSelectors.getVisiblePostComments]: (state) => state.visiblePostComments,
};
