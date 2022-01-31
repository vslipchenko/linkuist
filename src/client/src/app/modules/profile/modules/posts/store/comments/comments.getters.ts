import {Getters} from '@ng-estate/store';
import {PostsState} from '~app/modules/profile/modules/posts/store';
import {PostsSelectors} from '~app/modules/profile/modules/posts/store/posts.selectors';

export const PostCommentsGetters: Getters<PostsState> = {
  [PostsSelectors.getPostCommentsByPostId]: (state, payload: string) => state.postComments[payload],
  [PostsSelectors.getIsLoadingPostComments]: (state) => state.isLoadingPostComments,
  [PostsSelectors.getPostCommentCount]: (state, postId: string) =>
    state.postComments[postId]?.length ?? 0,
  [PostsSelectors.getPostCommentTotalCount]: (state, postId: string) =>
    state.postCommentTotalCount[postId],
};
