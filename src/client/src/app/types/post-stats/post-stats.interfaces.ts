import {State} from '~app/types/shared/shared.enums';

export interface LikePostMutationResult {
  likePost: {
    like: State;
    deletedCount: number;
  };
}
