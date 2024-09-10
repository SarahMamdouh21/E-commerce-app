import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly __HttpClient= inject(HttpClient);
  getallcategories():Observable<any>{
    return this.__HttpClient.get(`${environment.baseUrl}/api/v1/categories`)
  }
  getaonecategory(id:string):Observable<any>{
    return this.__HttpClient.get(`${environment.baseUrl}/api/v1/categories/${id}`)
  }
  getAllSubCategories(catgeoryId:string): Observable<any> {
    return this.__HttpClient.get(
      `${environment.baseUrl}/api/v1/categories/${catgeoryId}/subcategories`
    );
  }
}
