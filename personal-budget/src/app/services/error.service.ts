import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
providedIn: 'root'
})
export class ErrorService implements ErrorHandler{
  constructor(private injector: Injector) { }
  handleError(error: any) {
  const router = this.injector.get(Router);
  if (Error instanceof HttpErrorResponse) {
    console.log('Error status', error.status);
  }
  else {
    console.error('Error service detected an error:', error);
    if (error.sqlMessage) {alert(error.sqlMessage); }
    // console.error('Error:', error.error.err);
  }
  // router.navigate(['login']);
  }
}
