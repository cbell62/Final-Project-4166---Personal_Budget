import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError, Subject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { Budget } from './budget';
import { AuthService } from './auth.service';

import { config } from './../config';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  // public username;
  // public token;
  // public errMsg;

  constructor(private http: HttpClient, public authService: AuthService) {}

  // public getUserData(creds): any {
  //     const response = this.http.post('http://localhost:3000/api/login', creds);
  //     // this.token = response.token;
  //     return response;
  // }

  // public postLogin (creds): Observable<any> {
  //   return this.http.post('http://localhost:3000/api/login', creds)
  //     .pipe(
  //       catchError(this.handleError(creds))
  //     );
  // }

  // public postUserData(creds): any {
  //   const response = this.http.post('http://localhost:3000/api/signup', creds);
  //   // this.token = response.token;
  //   return response;
  // }

  public getAllBudgetData(): Observable<Budget[]> {
    return this.http
      .get<Budget[]>(
        `${config.apiUrl}/budget?user=${this.authService.getLoggedUser()}`
      )
      .pipe(
        tap((data) => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  public getBudget(id: number): Observable<Budget> {
    if (id === 0) {
      return of(this.initializeBudget());
    }
    const url = `${config.apiUrl}/budget/${id}`;
    return this.http.get<Budget>(url).pipe(
      tap((data) => console.log('getBudget: ', JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  public createBudget(budget: Budget): Observable<Budget> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    budget.id = null;
    return this.http
      .post<Budget>(`${config.apiUrl}/budget`, budget, { headers })
      .pipe(
        tap((data) => console.log('createBudget: ', JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  public deleteBudget(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${config.apiUrl}/budget/${id}`;
    return this.http
      .delete<Budget>(url, { headers })
      .pipe(
        tap((data) => console.log('deleteBudget: ', id)),
        catchError(this.handleError)
      );
  }

  public updateBudget(budget: Budget): Observable<Budget> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${config.apiUrl}/budget/${budget.id}`;
    return this.http
      .put<Budget>(url, budget, { headers })
      .pipe(
        tap(() => console.log('updateBudget: ', budget.id)),
        map(() => budget),
        catchError(this.handleError)
      );
  }

  private handleError(err): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

  private initializeBudget(): any {
    // Return an initialized object
    return [
      {
        id: 0,
        title: null,
        budget: null,
        color: null,
        expenses: 0,
        username: this.authService.getLoggedUser(),
      },
    ];
  }
}
