import {SortOrder} from '~app/types/shared/shared.enums';

export interface RequestParameters {
  order?: SortOrder;
  offset?: number;
  limit: number;
}

export interface ClientPresetQueryResult {
  clientPreset: {
    serverUtcTimestamp: number;
  };
}
