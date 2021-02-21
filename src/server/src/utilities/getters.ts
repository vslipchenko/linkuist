// export const getNullishProperties = <T extends Array<string>>(
//   source: {[k: string]: unknown},
//   propertyCheckList?: T,
//   includeUndefined?: boolean,
// ): T | null => {
//   const target = propertyCheckList ? propertyCheckList : Object.keys(source);
//   const result = target
//     .map((key) => {
//       if (source[key] === null || (includeUndefined ? source[key] === undefined : false)) {
//         return key;
//       }
//       return false;
//     })
//     .filter((value) => value) as T;
//
//   return result.length ? result : null;
// };
