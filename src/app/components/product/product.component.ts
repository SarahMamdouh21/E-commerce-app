import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ProductsService } from '../../core/service/products.service';
import { CartService } from '../../core/service/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Iproduct } from '../../core/interface/iproduct';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';
import { SearchPipe } from '../../core/pipe/search.pipe';
import { CurrencyPipe } from '@angular/common';
import { TermtxtPipe } from '../../core/pipe/termtxt.pipe';
import { WishlistService } from '../../core/service/wishlist.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [RouterLink, FormsModule, SearchPipe, CurrencyPipe, TermtxtPipe],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit,OnDestroy {
  private readonly __ProductsService = inject(ProductsService);
  private readonly __CartService = inject(CartService);
  private readonly __ToastrService = inject(ToastrService);
  private readonly __WishlistService = inject(WishlistService);
  wishlistUserDataId: string[] = [];
  wishlistSubscription!: Subscription;
  productlist: Iproduct[] = [];
  text: string = "";
  getallproducts!: Subscription;

  ngOnInit(): void {
    // Fetch all products
    this.wishlistSubscription = this.__WishlistService.wishlist$.subscribe(wishlist => {
      this.wishlistUserDataId = wishlist;
    });
    this.getallproducts = this.__ProductsService.getallproducts().subscribe({
      next: (res) => {
        console.log(res.data);
        this.productlist = res.data;
        
        // Restore wishlist from localStorage
        const savedWishlist = localStorage.getItem('wishlistUserDataId');
        if (savedWishlist) {
          this.wishlistUserDataId = JSON.parse(savedWishlist);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  addtocart(id: string): void {
    this.__CartService.addToCart(id).subscribe({
      next: (res) => {
        console.log(res);
        this.__ToastrService.success(`
            <div >
              <span>it has been added to cart successfully!</span>
              <span class="text-danger h3">&hearts;</span>
            </div>`, '', {
          enableHtml: true,
          closeButton: true,
          progressBar: true,
          progressAnimation: "increasing",
          positionClass: "toast-top-right",
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  addToWishlist(id: string): void {
    this.__WishlistService.addProductToWishlist(id).subscribe({
      next: (res) => {
        console.log(res);
        if (res.data) {
          this.wishlistUserDataId.push(id);  
          localStorage.setItem('wishlistUserDataId', JSON.stringify(this.wishlistUserDataId));
        }
        this.__ToastrService.success(`
          <div>
            <span>Product added to wishlist successfully!</span>
            <span class="text-danger h3">&hearts;</span>
          </div>`, '', {
          enableHtml: true,
          closeButton: true,
          progressBar: true,
          progressAnimation: "increasing",
          positionClass: "toast-top-right",
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  removeFromWishlist(productId: string): void {
    this.__WishlistService.deleteFromWishlist(productId).subscribe({
      next: (res) => {
        if (res.data) {
          // Remove product from wishlist
          this.wishlistUserDataId = this.wishlistUserDataId.filter(id => id !== productId);
          localStorage.setItem('wishlistUserDataId', JSON.stringify(this.wishlistUserDataId));
        }
      },
    });
  }

  trackById(index: number, product: Iproduct): string {
    return product.id;
  }
  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    if (this.wishlistSubscription) {
      this.wishlistSubscription.unsubscribe();
    }
  }
}
