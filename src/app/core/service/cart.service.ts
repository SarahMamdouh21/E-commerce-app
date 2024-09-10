import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private _HttpClient:HttpClient) { };
  cartNumber:BehaviorSubject<number>=new BehaviorSubject(0);
 myHeader:any={token:localStorage.getItem('usertoken')};
 addToCart(id:string):Observable<any>{

    return this._HttpClient.post(`${environment.baseUrl}/api/v1/cart`,
    {
      "productId": id
  },
  {
    headers: this.myHeader
  });
  }

  getCart():Observable<any>{

    return this._HttpClient.get(`${environment.baseUrl}/api/v1/cart`,{headers: this.myHeader});
  }
  deleteFromCart(id:string):Observable<any>{

    return this._HttpClient.delete(`${environment.baseUrl}/api/v1/cart/${id}`,
   
  {
    headers: this.myHeader
  }
  );
  }
  updateCart(id:string,newcount:number):Observable<any>{

    return this._HttpClient.put(`${environment.baseUrl}/api/v1/cart/${id}`,
   
  {
    "count": newcount
  }
  ,
   
  {
    headers: this.myHeader
  }
  );
  }
  clearCart():Observable<any>{

    return this._HttpClient.delete(`${environment.baseUrl}/api/v1/cart`,
   
  
   
  {
    headers: this.myHeader
  }
  );
  }
}
