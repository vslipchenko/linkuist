import {Immutable, StoreConfig} from '@ng-estate/store';
import {PostsSelectors} from '~app/modules/profile/modules/posts/store/posts.selectors';
import {PostsGetters} from '~app/modules/profile/modules/posts/store/posts.getters';
import {PostsActions} from '~app/modules/profile/modules/posts/store/posts.actions';
import {PostsReducers} from '~app/modules/profile/modules/posts/store/posts.reducers';
import {PostsEffects} from '~app/modules/profile/modules/posts/store/posts.effects';
import {UIPost} from '~app/types/post/post.interfaces';
import {PostComment} from '~app/types/post-comment/post-comment.interfaces';

export type PostsState = Immutable<{
  posts: Array<UIPost>;
  postTotalCount: number;
  postComments: {[postId: string]: Array<PostComment>};
  postCommentTotalCount: {[postId: string]: number};
  // visiblePostComments: {
  //   [postId: string]: {
  //     [commentId: string]: {[subcommentId: string]: boolean};
  //   };
  // };
  // profileTeasers: {[userId: string]: {username: string; avatarUrl: string}};
  isLoadingPosts: boolean;
  isLoadingPostComments: boolean;
}>;

const PostsInitialState: PostsState = {
  posts: [],
  postComments: {},
  postTotalCount: 0,
  postCommentTotalCount: {},
  // visiblePostComments: {},
  // profileTeasers: {},
  isLoadingPosts: false,
  isLoadingPostComments: false,
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
