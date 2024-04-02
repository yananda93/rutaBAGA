import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const LOGIN_API = environment.apiUrl + '/auth/login';
const LOGOUT_API = environment.apiUrl + '/auth/logout';
const INFO_API = environment.apiUrl + '/auth/info';
const REFRESH_API = environment.apiUrl + '/auth/refresh';
const CHANGEPW_API = environment.apiUrl + '/auth/changepw';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  isAdmin: string;
  userId: string
}

interface UserInfo {
  userId: number;
  isAdmin: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<LoginResponse>(LOGIN_API, {username,password})
    .pipe( 
      map(response => {
        window.sessionStorage.setItem('accessToken', response.accessToken);
        window.sessionStorage.setItem('refreshToken', response.refreshToken);
        window.sessionStorage.setItem('isAdmin', response.isAdmin);
        window.sessionStorage.setItem('userId', response.userId);
      // localStorage.setItem('accessToken', response.accessToken);
      // localStorage.setItem('refreshToken', response.refreshToken);
    }),
    catchError(this.errorHandler)
    );
  }


  isUserLoggedIn(): boolean {
    // change to test if token expired
    // if (localStorage.getItem("accessToken") != null) {
      if (window.sessionStorage.getItem("accessToken") != null) {
      return true;
    }
    return false;
  }

  logout(): void {
    // localStorage.clear();
    window.sessionStorage.clear();
    window.location.reload();
  }

  // isAdmin(): boolean {
  //   return localStorage.getItem('isAdmin') === 'true';
  // }

  changePW(newPW:String): Observable<any>  {
    return this.http.post(CHANGEPW_API, {newPW});
  }

  private errorHandler(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error(`authentication error: ${error.error.message}`);
    } else {
      console.error(`bad auth response: ${error.status}: ${error.statusText} ${JSON.stringify(error.error)}`);
    }
    return throwError('Login attempt failed');
  }
}
