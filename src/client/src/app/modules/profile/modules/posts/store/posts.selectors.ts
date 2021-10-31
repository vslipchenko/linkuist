export const PostsSelectors = {
  getPosts: 'Get all loaded posts',
  getPostCount: 'Get post count',
  getPostTotalCount: 'Get post total count',
  getIsLoadingPosts: 'Get posts load state',
  getIsLoadingPostComments: 'Get post comments load state',
  getPostCommentsByPostId: 'Get post comments by post id',
  getPostCommentTotalCount: 'Get post comment total count',
  getPostCommentCount: 'Get post comment count',
  // getVisiblePostComments: 'Get visible post comments',
} as const;
