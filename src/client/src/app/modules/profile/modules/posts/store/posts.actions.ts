import {PostCommentsActions} from '~app/modules/profile/modules/posts/store/comments/comments.actions';
import {PostRepliesActions} from '~app/modules/profile/modules/posts/store/replies/replies.actions';

export const PostsActions = {
  createPost: 'Create post',
  prependPost: 'Prepend post',
  deletePost: 'Delete post',
  removePost: 'Remove post from posts',
  likePost: 'Like post',
  setPostLike: 'Set post like',
  loadPosts: 'Load bunch of posts based on user id',
  appendPosts: 'Append posts',
  ...PostCommentsActions,
  ...PostRepliesActions,
} as const;
