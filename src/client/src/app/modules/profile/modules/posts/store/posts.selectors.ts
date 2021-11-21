export const PostsSelectors = {
  getPosts: 'Get all loaded posts',
  getPostCount: 'Get post count',
  getPostTotalCount: 'Get post total count',
  getIsLoadingPosts: 'Get posts load state',
  getIsLoadingPostComments: 'Get post comments load state',
  getPostCommentsByPostId: 'Get post comments by post id',
  getPostSubcommentsByCommentId: 'Get post subcomments by post id',
  getPostCommentTotalCount: 'Get post comment total count',
  getPostSubcommentTotalCount: 'Get post subcomment total count',
  getPostCommentCount: 'Get post comment count',
  getPostSubcommentCount: 'Get post subcomment count',
  // getVisiblePostComments: 'Get visible post comments',
} as const;
