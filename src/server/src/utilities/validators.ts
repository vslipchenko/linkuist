import {isArray as _isArray} from 'lodash';

interface ValidateData {
  data: string | Array<string>;
  regexp: RegExp
}

export const isValidData = (payload: ValidateData | Array<ValidateData>): boolean => {
  const hasOnlyValidData = (item: ValidateData): boolean => {
    const {data, regexp} = item;

    if (_isArray(data)) {
      return data.map((dataItem) => regexp.test(dataItem))
        .every((isTrue) => isTrue);
    } else {
      return regexp.test(data);
    }
  };

  if (_isArray(payload)) {
    return payload.map((item) => {
      return hasOnlyValidData(item);
    }).every((isTrue) => isTrue);
  } else {
    return hasOnlyValidData(payload);
  }
};
