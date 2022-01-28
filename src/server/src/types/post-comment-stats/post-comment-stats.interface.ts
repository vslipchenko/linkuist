import {State} from '../shared/shared.enums';

export interface IPostCommentStats {
  commentId: string;
  userId: string;
  like: State;
}
