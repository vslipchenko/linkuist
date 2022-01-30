import {Immutable, StoreConfig} from '@ng-estate/store';
import {PostsSelectors} from '~app/modules/profile/modules/posts/store/posts.selectors';
import {PostsGetters} from '~app/modules/profile/modules/posts/store/posts.getters';
import {PostsActions} from '~app/modules/profile/modules/posts/store/posts.actions';
import {PostsReducers} from '~app/modules/profile/modules/posts/store/posts.reducers';
import {PostsEffects} from '~app/modules/profile/modules/posts/store/posts.effects';
import {UIPost} from '~app/types/post/post.interfaces';
import {UIPostComment} from '~app/types/post-comment/post-comment.interfaces';
import {UIPostReply} from '~app/types/post-reply/post-reply.interfaces';

export type PostsState = Immutable<{
  posts: Array<UIPost>;
  postTotalCount: number;
  postComments: {[postId: string]: Array<UIPostComment>};
  postReplies: {[commentId: string]: Array<UIPostReply>};
  postCommentReplyTotalCount: {[postId: string]: number};
  postCommentTotalCount: {[postId: string]: number};
  postReplyTotalCount: {[commentId: string]: number};
  // visiblePostComments: {
  //   [postId: string]: {
  //     [commentId: string]: {[replyId: string]: boolean};
  //   };
  // };
  // profileTeasers: {[userId: string]: {username: string; avatarUrl: string}};
  isLoadingPosts: boolean;
  isLoadingPostComments: boolean;
  isLoadingPostReplies: boolean;
}>;

const PostsInitialState: PostsState = {
  posts: [],
  postComments: {},
  postReplies: {},
  postTotalCount: 0,
  postCommentReplyTotalCount: {},
  postCommentTotalCount: {},
  postReplyTotalCount: {},
  // visiblePostComments: {},
  // profileTeasers: {},
  isLoadingPosts: false,
  isLoadingPostComments: false,
  isLoadingPostReplies: false,
};

export const PostsStore: StoreConfig<PostsState> = {
  id: 'Posts',
  initialState: PostsInitialState,
  selectors: PostsSelectors,
  getters: PostsGetters,
  actions: PostsActions,
  reducers: PostsReducers,
  effects: PostsEffects,
} as const;
