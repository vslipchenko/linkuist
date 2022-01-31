import {PostCommentsSelectors} from '~app/modules/profile/modules/posts/store/comments/comments.selectors';
import {PostRepliesSelectors} from '~app/modules/profile/modules/posts/store/replies/replies.selectors';

export const PostsSelectors = {
  getPosts: 'Get all loaded posts',
  // getPostCount: 'Get post count',
  getPostTotalCount: 'Get post total count',
  getIsLoadingPosts: 'Get posts load state',

  // getPostCommentReplyTotalCount: 'Get post comment & reply total count',
  getPostCommentReplyTotalCount: 'Get post comment & reply total count',
  // getVisiblePostComments: 'Get visible post comments',
  ...PostCommentsSelectors,
  ...PostRepliesSelectors,
} as const;
