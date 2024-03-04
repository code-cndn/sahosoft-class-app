import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../shared/common.service';
import {LoaderService} from '../../shared/components/other/loader/loader.service';
import { CryptoService } from '../../shared/crypto.service';
import { invoke } from '@tauri-apps/api'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  router = inject(Router);
  _common = inject(CommonService);
  _crypto = inject(CryptoService);
  public currentUser = signal( JSON.parse(this._crypto.getStorage("SYSUSER_DT")) || null); // for token
  public isLoggedIn = signal( JSON.parse(this._crypto.getStorage("SYSUSER_DT")) == null ? false : true);
  public visitorId = signal(this._crypto.getStorage("VISITOR") || null);
  

  authLogin(res: any) {

    this._common.getUserByEmailId(res).subscribe(resData => {
      if (resData.isSuccess) {
        let obj = {
          ...res,
          userId: resData.data.id
        }
        this.setFp(obj, res);
      }
    });

  }
  osData:any;
  setFp = async (obj:any,res:any) => {

   await invoke('create_point')
    .then((message) => {
      this.osData = message
    })
    .catch((error) => console.error(error))
    
    this._crypto.setStorage("VISITOR", this.osData.hwuuid);
    this._crypto.setStorage("SYSUSER_DT", JSON.stringify(obj))
    this.currentUser.set(res);
    this.isLoggedIn.set(true);
    this.visitorId.set(this.osData.hwuuid);
   
    this.router.navigate(['user/dashboard']);
    LoaderService.hideLoader();

  }
  logout() {
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
