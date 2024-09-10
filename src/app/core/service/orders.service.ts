import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  myHeader:any={token:localStorage.getItem('usertoken')};
  private readonly __HttpClient=inject(HttpClient);
  checkout(idCart:string |null,shippingDetails:object):Observable<any>{

    return this.__HttpClient.post(`${environment.baseUrl}/api/v1/orders/checkout-session/${idCart}?url=${environment.localhost}`,
    {
      "shippingAddress":shippingDetails
  },
  {
    headers: this.myHeader
  }
  );
  }
  allOrders(userId: string) : Observable<any> {
    return this.__HttpClient.get(
      `${environment.baseUrl}/api/v1/orders/user/${userId}`
    );
  }
}
