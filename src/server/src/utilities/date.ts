// import {MONTH_NAMES} from '../constants/date';

export const getUtcTimestamp = (): number => new Date().getTime();

// export const composePostDate = (timestamp: number): string => {
//   const date = new Date(timestamp);
//   const currentYear = new Date().getFullYear();
//
//   const day = date.getDate();
//   const monthName = MONTH_NAMES[date.getMonth()];
//   const year = date.getFullYear();
//
//   return `${day} ${monthName} ${currentYear > year ? year : ''}`.trim();
// };
