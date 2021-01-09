export type KeysAndValues<K, V = unknown> = { [k in keyof K]: V };
