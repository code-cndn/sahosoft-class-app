
import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { CryptoService } from '../../shared/crypto.service';
//import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  _crypto = inject(CryptoService);
  constructor(private _authService: AuthService, private router: Router) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let userDetsils = JSON.parse(this._crypto.getStorage("SYSUSER_DT"))  || null;
    if (userDetsils && userDetsils != null) {
      return true;
    } else {
      this.router.navigate(['home']);
      return false;
    }



  }
}
