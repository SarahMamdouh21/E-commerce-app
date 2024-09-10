import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private readonly __HttpClient=inject(HttpClient);
  

  getallproducts():Observable<any>{
    return this.__HttpClient.get(`${environment.baseUrl}/api/v1/products`)
  }
  getoneproduct(id:string | null):Observable<any>{
    return this.__HttpClient.get(`${environment.baseUrl}/api/v1/products/${id}`)
  }
}
