import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(){
    if(this.auth.isUserLoggedIn()) {
      return true;
    }
    else {
      this.router.navigate(['login']);
    }

  }
  
}
