import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {

  constructor(private _HttpClient: HttpClient) { }

  getAllBrands(): Observable<any> {
    return this._HttpClient.get<any>(
      `${environment.baseUrl}/api/v1/brands`
    );
  }
}
