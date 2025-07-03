import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})

export class TopbarService {
  /* flujo RxJS (para pipes async) */
  private _visible = new BehaviorSubject<boolean>(true);
  visible$ = this._visible.asObservable();


  readonly visibleSignal = toSignal(this.visible$, { initialValue: true });

  setVisible(state: boolean): void {
    this._visible.next(state);
  }
}