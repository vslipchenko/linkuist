import {Getters} from '@ng-estate/store';
import {PostsState} from '~app/modules/profile/modules/posts/store';
import {PostsSelectors} from '~app/modules/profile/modules/posts/store/posts.selectors';

export const PostRepliesGetters: Getters<PostsState> = {
  [PostsSelectors.getPostRepliesByCommentId]: (state, payload: string) =>
    state.postReplies[payload],
  [PostsSelectors.getIsLoadingPostReplies]: (state) => state.isLoadingPostReplies,
  [PostsSelectors.getPostReplyCount]: (state, commentId: string) =>
    state.postReplies[commentId]?.length ?? 0,

  [PostsSelectors.getPostReplyTotalCount]: (state, commentId: string) =>
    state.postReplyTotalCount[commentId],
};
