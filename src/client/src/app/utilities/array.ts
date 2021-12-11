import {Immutable} from '@ng-estate/store';

export const immutableInsertAt = <T>(
  array: Immutable<Array<T>>,
  position: number,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  value: any,
): Immutable<Array<T>> => {
  return [...array.slice(0, position), value, ...array.slice(position)];
};
