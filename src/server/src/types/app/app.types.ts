export type KeysAndValues<K, V = unknown> = { [key in keyof K]: V };
