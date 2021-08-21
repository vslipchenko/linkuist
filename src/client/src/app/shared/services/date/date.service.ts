import {Injectable, NgZone} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  private _serverUtcTimestamp = 0;
  private readonly _serverUtcTimestampTick$ = new Subject<number>();

  public constructor(private readonly zone: NgZone) {}

  public set serverUtcTimestamp(serverUtcTimestamp: number) {
    // const clientTimestampAfterResponse = new Date().getTime();

    this._serverUtcTimestamp = serverUtcTimestamp;
    // Reason to have a tick equal to 1 minute https://developer.chrome.com/blog/timer-throttling-in-chrome-88/#intensive-throttling
    this.zone.runOutsideAngular(() => {
      setInterval(() => {
        this._serverUtcTimestamp += 60000; // 1000 * 60
        this.zone.run(() => {
          this._serverUtcTimestampTick$.next(this._serverUtcTimestamp);
        });
      }, 60000);
    });

    // setInterval(() => console.debug(new Date(this.serverUtcTimestamp)), 1000);
  }

  public get serverUtcTimestamp(): number {
    return this._serverUtcTimestamp;
  }

  public get serverUtcTimestampTick$(): Observable<number> {
    return this._serverUtcTimestampTick$.asObservable();
  }

  // public getServerUtcTimestampPeriodicEmitter(period: number): Observable<number> {
  //   return interval(period).pipe(
  //     startWith(this._serverUtcTimestamp),
  //     map(() => this._serverUtcTimestamp),
  //   );
  // }
}
