import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopbarService {

  constructor() { }
  private _visible = new BehaviorSubject<boolean>(true);
  visible$ = this._visible.asObservable();
  setVisible(state: boolean) { this._visible.next(state); }

}
