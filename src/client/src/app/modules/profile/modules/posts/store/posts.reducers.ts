import {PostsActions} from '~app/modules/profile/modules/posts/store/posts.actions';
import {ReducerResult, Reducers} from '@ng-estate/store';
import {PostsState} from '~app/modules/profile/modules/posts/store/index';
import {UIPost} from '~app/types/post/post.interfaces';

export const PostsReducers: Reducers<PostsState> = {
  [PostsActions.prependPost]: (state, newPost: UIPost): ReducerResult<PostsState> => ({
    ...state,
    posts: [newPost, ...state.posts],
  }),
  [PostsActions.removePost]: (state, _id: string): ReducerResult<PostsState> => ({
    ...state,
    posts: state.posts.filter((post) => post._id !== _id),
  }),
  [PostsActions.appendPosts]: (state, posts: Array<UIPost>): ReducerResult<PostsState> => ({
    ...state,
    posts: [...state.posts, ...posts],
  }),
};
