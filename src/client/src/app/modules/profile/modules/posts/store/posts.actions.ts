import {PostCommentsActions} from '~app/modules/profile/modules/posts/store/comments/comments.actions';

export const PostsActions = {
  createPost: 'Create post',
  // prependReply: 'Create post',
  prependPost: 'Prepend post',

  removeReplyThread: 'Remove replies for specific post comment',

  deletePost: 'Delete post',
  removePost: 'Remove post from posts',
  likePost: 'Like post',

  setPostLike: 'Set post like',

  // dislikePost: 'Dislike post',

  createPostReply: 'Create post reply',
  deletePostReply: 'Delete post reply',
  removePostReply: 'Remove post reply',
  insertPostReply: 'Insert post reply at certain position',
  // createPostReply: 'Create post reply',

  appendPostReplies: 'Append post replies',
  loadPosts: 'Load bunch of posts based on user id',

  loadPostReplies: 'Load post replies',
  appendPosts: 'Append posts',
  ...PostCommentsActions,
} as const;
