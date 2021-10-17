import {Immutable, StoreConfig} from '@ng-estate/store';
import {PostsSelectors} from '~app/modules/profile/modules/posts/store/posts.selectors';
import {PostsGetters} from '~app/modules/profile/modules/posts/store/posts.getters';
import {PostsActions} from '~app/modules/profile/modules/posts/store/posts.actions';
import {PostsReducers} from '~app/modules/profile/modules/posts/store/posts.reducers';
import {PostsEffects} from '~app/modules/profile/modules/posts/store/posts.effects';
import {UIPost} from '~app/types/post/post.interfaces';

export type PostsState = Immutable<{
  posts: Array<UIPost>;
  profileTeasers: {[userId: string]: {username: string; avatarUrl: string}};
}>;

const PostsInitialState: PostsState = {
  posts: [],
  profileTeasers: {},
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
