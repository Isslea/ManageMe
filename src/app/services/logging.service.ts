import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {AuthModel} from "../models/auth.model";
import {BehaviorSubject, catchError, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  private isUserLoggedSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  isUserLogged$ = this.isUserLoggedSubject.asObservable();

  setUserLogged(value: boolean): void {
    this.isUserLoggedSubject.next(value);
  }

  signup(email: string, password: string) {
    return this.http
      .post<AuthModel>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD3cV-bRE2pPVejywpasHInm3-hCBoaQYA',
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(
        catchError((errorRes: HttpErrorResponse) => {
          let errorMessage = 'An unknown error occurred!';
          if (errorRes.error && errorRes.error.error && errorRes.error.error.message === 'EMAIL_EXISTS') {
            errorMessage = 'This email exists already';
          }
          return throwError(errorMessage);
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthModel>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD3cV-bRE2pPVejywpasHInm3-hCBoaQYA',
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(
        catchError((errorRes: HttpErrorResponse) => {
          let errorMessage = 'An unknown error occurred!';
          if (errorRes.error && errorRes.error.error) {
            switch (errorRes.error.error.message) {
              case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exist.';
                break;
              case 'INVALID_PASSWORD':
                errorMessage = 'This password is not correct.';
                break;
            }
          }
          return throwError(errorMessage);
        })
      );
  }

}


