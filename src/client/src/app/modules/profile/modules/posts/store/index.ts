import {Immutable, StoreConfig} from '@ng-estate/store';
import {PostsSelectors} from '~app/modules/profile/modules/posts/store/posts.selectors';
import {PostsGetters} from '~app/modules/profile/modules/posts/store/posts.getters';
import {PostsActions} from '~app/modules/profile/modules/posts/store/posts.actions';
import {PostsReducers} from '~app/modules/profile/modules/posts/store/posts.reducers';
import {PostsEffects} from '~app/modules/profile/modules/posts/store/posts.effects';
import {UIPost} from '~app/types/post/post.interfaces';
import {UIPostComment} from '~app/types/post-comment/post-comment.interfaces';
import {UIPostSubcomment} from '~app/types/post-subcomment/post-subcomment.interfaces';

export type PostsState = Immutable<{
  posts: Array<UIPost>;
  postTotalCount: number;
  postComments: {[postId: string]: Array<UIPostComment>};
  postSubcomments: {[commentId: string]: Array<UIPostSubcomment>};
  postCommentSubcommentTotalCount: {[postId: string]: number};
  postCommentTotalCount: {[postId: string]: number};
  postSubcommentTotalCount: {[commentId: string]: number};
  // visiblePostComments: {
  //   [postId: string]: {
  //     [commentId: string]: {[subcommentId: string]: boolean};
  //   };
  // };
  // profileTeasers: {[userId: string]: {username: string; avatarUrl: string}};
  isLoadingPosts: boolean;
  isLoadingPostComments: boolean;
  isLoadingPostSubcomments: boolean;
}>;

const PostsInitialState: PostsState = {
  posts: [],
  postComments: {},
  postSubcomments: {},
  postTotalCount: 0,
  postCommentSubcommentTotalCount: {},
  postCommentTotalCount: {},
  postSubcommentTotalCount: {},
  // visiblePostComments: {},
  // profileTeasers: {},
  isLoadingPosts: false,
  isLoadingPostComments: false,
  isLoadingPostSubcomments: false,
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
