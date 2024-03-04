import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, map, catchError } from 'rxjs/operators';



@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<unknown>, next:HttpHandler): Observable<HttpEvent<unknown>> {
    // LoaderService.showLoader();
    return next.handle(req).pipe(
     
      retry(3),
      map(res => {
        if (res instanceof HttpResponse) {
          // LoaderService.hideLoader();
          return res;
        }
        return null;
      }),
      catchError((err: HttpErrorResponse) => {
        let errMsg = "";
        if (err.error instanceof ErrorEvent) { // Client-side error
          errMsg = ` ${err.message}`;
       
        } else { // Server-side error
          errMsg = ` ${err.message} Error Status : ${err.status}`;
          // this._toastr.error(err.error.errors, "Error");
        }
        // LoaderService.hideLoader();
        return throwError(() => Error(errMsg));
      })
    )
  }
}
