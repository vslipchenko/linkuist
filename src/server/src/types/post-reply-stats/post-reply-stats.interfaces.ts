import {State} from '../shared/shared.enums';

export interface IPostReplyStats {
  replyId: string;
  userId: string;
  like: State;
}
