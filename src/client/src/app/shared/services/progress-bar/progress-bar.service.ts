import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {
  #showProgressBar$ = new BehaviorSubject(false);

  constructor() {
  }

  show(): void {
    this.#showProgressBar$.next(true);
  }

  hide(): void {
    this.#showProgressBar$.next(false);
  }

  get showProgressBar$(): Observable<boolean> {
    return this.#showProgressBar$.asObservable();
  }
}
