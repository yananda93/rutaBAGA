import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { FinishedService } from './finished.service';





@Injectable({
  providedIn: 'root'
})
export class FinishedGuard implements CanActivate {
  reviewFinished = false;
  summaryFinished = false;
  reviewedStatusSubscription = this.finishedService.reviewFinished.subscribe(value => this.reviewFinished = value);
  summaryVisitedStatusSubscription = this.finishedService.summaryFinished.subscribe(value => this.summaryFinished = value);

    constructor(
      private finishedService: FinishedService,

    ) { }

    canActivate(){
      if (this.reviewFinished && this.summaryFinished) {
        return false;
      }
      else {
        return true;
      }
    }


}


