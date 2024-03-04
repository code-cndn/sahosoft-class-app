import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../views/auth/auth.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor(private _authService: AuthService) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let request: any;
    let currentUser: any;
      if (this._authService.isLoggedIn()) {
       let res =  this._authService.currentUser();
          currentUser = res;
          request = req.clone({
            setHeaders: {
              'Authorization': `Bearer ${currentUser.token}`
            }
          });
        
      }else{
        req.clone({
          setHeaders: {
            'Content-Type': 'application/json'
          }
        });
      } 
    

    return next.handle(request ? request : req);
  }
}



