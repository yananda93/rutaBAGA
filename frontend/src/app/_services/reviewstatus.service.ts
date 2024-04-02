import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewStatusService {
    private myVariableSource: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    finished = this.myVariableSource.asObservable();
  
    constructor() { }
  
    setVariable(value: any): void {
      this.myVariableSource.next(value);
    }
}