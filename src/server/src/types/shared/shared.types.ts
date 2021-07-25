import {SortOrder} from './shared.enums';

export interface RequestParameters {
  order?: SortOrder;
  offset?: number;
  limit: number;
}
