import {State} from '../shared/shared.enums';

export interface IPostStats {
  postId: string;
  userId: string;
  like: State;
}
