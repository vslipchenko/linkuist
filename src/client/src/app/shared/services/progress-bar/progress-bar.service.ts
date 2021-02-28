import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProgressBarService {
  private readonly _showProgressBar$ = new BehaviorSubject(false);

  public show(): void {
    this._showProgressBar$.next(true);
  }

  public hide(): void {
    this._showProgressBar$.next(false);
  }

  public get showProgressBar$(): Observable<boolean> {
    return this._showProgressBar$.asObservable();
  }
}
