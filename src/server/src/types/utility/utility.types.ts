export type ObjectKeysOfAndValues<K, V> = { [k in keyof K]: V };
export type ObjectValuesAndKeys<V, K extends symbol | string | number = symbol | string | number> = { [k in K]: V };
