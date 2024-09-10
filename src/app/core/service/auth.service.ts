import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usertoken:any=null;

  private readonly _HttpClient=inject(HttpClient);
  private readonly __Router=inject(Router);

  setregisterform(data:object):Observable<any>{
   return this._HttpClient.post(`${environment.baseUrl}/api/v1/auth/signup`,data)
  }
  setloginform(data:object):Observable<any>{
   return this._HttpClient.post(`${environment.baseUrl}/api/v1/auth/signin`,data)
  }

  saveuserdata():void{
    if(localStorage.getItem('usertoken') !== null){
       this.usertoken=   jwtDecode(localStorage.getItem('usertoken')!)
    }
  }
  signout():void{
     localStorage.removeItem('usertoken');
     this.usertoken=null;
     this.__Router.navigate(['/login'])
  }

  verifyemail(data:object):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}/api/v1/auth/forgotPasswords`,data)
  }
  verifycode(data:object):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}/api/v1/auth/verifyResetCode`,data)
  }
  resetpass(data:object):Observable<any>{
    return this._HttpClient.put(`${environment.baseUrl}/api/v1/auth/resetPassword`,data)
  }
}
