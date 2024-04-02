import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FinishedService{
    private myVariableSource: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    reviewFinished = this.myVariableSource.asObservable();

    private myVariableSource1: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    summaryFinished = this.myVariableSource1.asObservable();
    constructor() { }
  
    setVariable(value: any): void {
      // console.log("set review finished to: " + value);
      this.myVariableSource.next(value);
    }

    setSummaryVariable(value: any): void {
      // console.log("set summary finished to: " + value);
    
      this.myVariableSource1.next(value);

    }

}


