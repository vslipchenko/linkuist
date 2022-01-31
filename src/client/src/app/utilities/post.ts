import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {endWith, map, startWith, takeWhile} from 'rxjs/operators';
import {
  determineElapsedTimeMeasure,
  hasMoreMillisecondsThanDay,
  millisecondsToHours,
  millisecondsToMinutes,
} from '~app/utilities/date';
import {ElapsedTimeMeasure, State} from '~app/types/shared/shared.enums';
import {DateService} from '~app/shared/services/date/date.service';

export const getPostFullDate = (createdAt: number, translateService: TranslateService): string => {
  const createdAtDate = new Date(createdAt);
  const createdAtYear = createdAtDate.getFullYear();
  const createdAtDayPhrase = translateService.instant(
    `DATE.CREATED_AT_DAY.${createdAtDate.getDay()}`,
  ) as string;
  const createdAtMonthPhrase = translateService.instant(
    `DATE.CREATED_AT_MONTH.${createdAtDate.getMonth()}`,
  ) as string;
  const createdAtPhrase = translateService.instant('DATE.CREATED_AT') as string;
  const createdAtHours =
    createdAtDate.getHours() < 10 ? `0${createdAtDate.getHours()}` : createdAtDate.getHours();
  const createdAtMinutes =
    createdAtDate.getMinutes() < 10 ? `0${createdAtDate.getMinutes()}` : createdAtDate.getMinutes();

  return `${createdAtDayPhrase}, ${createdAtDate.getDate()} ${createdAtMonthPhrase} ${createdAtYear} ${createdAtPhrase} ${createdAtHours}:${createdAtMinutes}`;
};

export const getPostShortDate = ({
  createdAt,
  serverUtcTimestamp,
  translateService,
}: {
  createdAt: number;
  serverUtcTimestamp: number;
  translateService: TranslateService;
}): string => {
  const createdAtDate = new Date(createdAt);
  const createdAtYear = createdAtDate.getFullYear();
  const haveYearDifference = new Date(serverUtcTimestamp).getFullYear() - createdAtYear > 0;
  const createdAtMonth = translateService.instant(
    `DATE.CREATED_AT_MONTH.${createdAtDate.getMonth()}`,
  ) as string;

  return `${createdAtDate.getDate()} ${createdAtMonth} ${
    haveYearDifference ? createdAtYear : ''
  }`.trim();
};

export const getTimeElapsedAfterCreation$ = ({
  createdAt,
  // callback,
  dateService,
  translateService,
}: {
  createdAt: number;
  // callback: () => any;
  dateService: DateService;
  translateService: TranslateService;
}): Observable<string> => {
  return dateService.serverUtcTimestampTick$ // Update UI each minute
    .pipe(
      startWith(dateService.serverUtcTimestamp),
      takeWhile(
        (serverUtcTimestamp: number) =>
          !hasMoreMillisecondsThanDay(serverUtcTimestamp - createdAt, true), // Use inclusive in order to state the actual date instead of 1d
      ),
      endWith(
        getPostShortDate({
          createdAt,
          serverUtcTimestamp: dateService.serverUtcTimestamp,
          translateService,
        }),
      ), // Emitted each time whenever subscription to completed observable happens
      map((value) => {
        // TODO: possible improvement is to set timeElapsedAfterCreation in order to avoid subscription in template, using following:
        //  post.timeElapsedAfterCreation
        // ? post.timeElapsedAfterCreation
        // : (post.timeElapsedAfterCreation$ | async
        if (typeof value === 'string') return value;

        // At this point this.dateService.serverUtcTimestamp has relevant value until, this part of the code executed with ~1m lag
        const millisecondsElapsed = dateService.serverUtcTimestamp - createdAt;
        // {
        //   // Let change detection spot it's time change for the last time
        //   // newPost.millisecondsElapsed = millisecondsElapsed;
        //   // Nullify observable
        //   newPost.timeElapsedAfterCreation$ = null;
        //   // MUTATES; use timeElapsedAfterCreation for the rest of a time
        //   return (newPost.timeElapsedAfterCreation = value); // endWith emitted value
        //
        //   // callback({timeElapsedAfterCreation, timeElapsedAfterCreation$});
        //
        //   // return value;
        // }

        // const millisecondsElapsed = value - originalPost.createdAt;
        // MUTATES
        // newPost.millisecondsElapsed = millisecondsElapsed;

        const measure = determineElapsedTimeMeasure(millisecondsElapsed);

        switch (measure) {
          case ElapsedTimeMeasure.SECOND:
            return translateService.instant('DATE.JUST_NOW');
          case ElapsedTimeMeasure.MINUTE:
            return translateService.instant('DATE.MINUTES_PASSED', {
              number: millisecondsToMinutes(millisecondsElapsed),
            });
          case ElapsedTimeMeasure.HOUR:
            return translateService.instant('DATE.HOURS_PASSED', {
              number: millisecondsToHours(millisecondsElapsed),
            });
        }
      }),
      // tap(() => this.changeDetector.detectChanges()),
    );
};

export const getLikeIncrement = (
  previousLikeState: State,
  currentLikeState: State,
): {like: number; dislike: number} => {
  let like = 0;
  let dislike = 0;

  switch (true) {
    // like
    case !previousLikeState && currentLikeState === State.YES:
      like++;
      break;
    // dislike
    case !previousLikeState && currentLikeState === State.NO:
      dislike++;
      break;
    // undo like
    case previousLikeState === State.YES && !currentLikeState:
      like--;
      break;
    // undo dislike
    case previousLikeState === State.NO && !currentLikeState:
      dislike--;
      break;
    // like to dislike
    case previousLikeState === State.YES && currentLikeState === State.NO:
      like--;
      dislike++;
      break;
    // dislike to like
    case previousLikeState === State.NO && currentLikeState === State.YES:
      like++;
      dislike--;
      break;
  }

  return {like, dislike};
};
