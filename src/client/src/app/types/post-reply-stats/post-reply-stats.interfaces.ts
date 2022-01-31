import {State} from '~app/types/shared/shared.enums';

export interface LikePostReplyMutationResult {
  likePostReply: {
    like: State;
    deletedCount: number;
  };
}
