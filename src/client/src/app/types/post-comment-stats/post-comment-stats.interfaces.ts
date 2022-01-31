import {State} from '~app/types/shared/shared.enums';

export interface LikePostCommentMutationResult {
  likePostComment: {
    like: State;
    deletedCount: number;
  };
}
