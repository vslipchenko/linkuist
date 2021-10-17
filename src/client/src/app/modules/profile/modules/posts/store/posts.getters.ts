import {Getters} from '@ng-estate/store';
import {PostsState} from '~app/modules/profile/modules/posts/store/index';
import {PostsSelectors} from '~app/modules/profile/modules/posts/store/posts.selectors';

export const PostsGetters: Getters<PostsState> = {
  [PostsSelectors.getPosts]: (state) => state.posts,
};
