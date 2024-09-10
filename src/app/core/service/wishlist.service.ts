import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistSubject = new BehaviorSubject<string[]>(this.loadWishlistFromStorage());

  wishlist$ = this.wishlistSubject.asObservable(); // Observable for the components

  constructor(private _HttpClient: HttpClient) {}

  myHeader = { token: localStorage.getItem('usertoken') || '' };

  private loadWishlistFromStorage(): string[] {
    const storedWishlist = localStorage.getItem('wishlistUserDataId');
    return storedWishlist ? JSON.parse(storedWishlist) : [];
  }

  private updateWishlist(wishlist: string[]) {
    localStorage.setItem('wishlistUserDataId', JSON.stringify(wishlist));
    this.wishlistSubject.next(wishlist); // Update subscribers
  }

  addProductToWishlist(productId: string): Observable<any> {
    return this._HttpClient.post(
      `${environment.baseUrl}/api/v1/wishlist`,
      { productId },
      { headers: this.myHeader }
    ).pipe(
      tap(() => {
        const currentWishlist = this.loadWishlistFromStorage();
        currentWishlist.push(productId);
        this.updateWishlist(currentWishlist);
      })
    );
  }

  getLoggedUserWishlist(): Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/wishlist`, {
      headers: this.myHeader
    }).pipe(
      tap((response: any) => {
        const wishlistIds = response.data.map((item: any) => item._id);
        this.updateWishlist(wishlistIds);
      })
    );
  }

  deleteFromWishlist(id: string): Observable<any> {
    return this._HttpClient.delete(
      `${environment.baseUrl}/api/v1/wishlist/${id}`,
      { headers: this.myHeader }
    ).pipe(
      tap(() => {
        const currentWishlist = this.loadWishlistFromStorage().filter(itemId => itemId !== id);
        this.updateWishlist(currentWishlist);
      })
    );
  }
}
