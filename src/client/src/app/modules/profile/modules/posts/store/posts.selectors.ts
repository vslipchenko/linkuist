import {PostCommentsSelectors} from '~app/modules/profile/modules/posts/store/comments/comments.selectors';

export const PostsSelectors = {
  getPosts: 'Get all loaded posts',
  // getPostCount: 'Get post count',
  getPostTotalCount: 'Get post total count',
  getIsLoadingPosts: 'Get posts load state',
  getIsLoadingPostReplies: 'Get post replies load state',
  getPostRepliesByCommentId: 'Get post replies by post id',
  getPostReplyTotalCount: 'Get post reply total count',
  // getPostRepliesTotalCount: 'Get post replies total count',
  getPostReplyCount: 'Get post reply count',
  // getPostCommentReplyTotalCount: 'Get post comment & reply total count',
  getPostCommentReplyTotalCount: 'Get post comment & reply total count',
  // getVisiblePostComments: 'Get visible post comments',
  ...PostCommentsSelectors,
} as const;
