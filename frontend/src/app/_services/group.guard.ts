import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApplicationService } from './application.service';
import { UserService } from './user.service';
import { Location } from '@angular/common'


@Injectable({
  providedIn: 'root'
})
export class GroupGuard implements CanActivate {
  constructor(
    private application: ApplicationService, 
    private userService: UserService, 
    private router: Router,
    private location: Location
  ) {}
  canActivate(){
    // return true;
    if(this.application.enableGroupView()) {
      return true;
    }
    else {
      alert("The group view will be available once all committee members complete review duties, come back later :)");
      this.router.navigate(['home']);
      // this.location.back()
    }
  }
  
}