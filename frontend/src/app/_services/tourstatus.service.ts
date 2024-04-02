import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TourStatusService {
    private myVariableSource: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    finished = this.myVariableSource.asObservable();

    private myVariableSource1: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    summaryToured = this.myVariableSource1.asObservable();
  
    constructor() { }
  
    setVariable(value: any): void {
      this.myVariableSource.next(value);
    }

    setSummaryVariable(value: any): void {
      // console.log("set summary toured to: " + value);
      this.myVariableSource1.next(value);
    }
}