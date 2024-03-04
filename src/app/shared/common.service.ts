import { Injectable, signal } from '@angular/core';
import { HttpService } from './http.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  isVideoPlayed = signal(false);
  constructor(private _http:HttpService) { }

  // Registration_Users/GetUserByEmailId
  getUserByEmailId(data:any) {
   return this._http.get(environment.BASE_API_PATH+"Registration_Users/GetUserByEmailId/"+data.email);
  
  }
}
