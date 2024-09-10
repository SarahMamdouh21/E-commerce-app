import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ProductsService } from '../../core/service/products.service';
import { Iproduct } from '../../core/interface/iproduct';
import { Subscription } from 'rxjs';
import { CategoryService } from '../../core/service/category.service';
import { Icategory } from '../../core/interface/icategory';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { TermtxtPipe } from '../../core/pipe/termtxt.pipe';
import { SearchPipe } from '../../core/pipe/search.pipe';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/service/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../core/service/wishlist.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselModule,RouterLink,TermtxtPipe,SearchPipe,CurrencyPipe,FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly __ProductsService = inject(ProductsService);
  private readonly __CategoryService = inject(CategoryService);
  private readonly __CartService = inject(CartService);
  private readonly __ToastrService=inject(ToastrService);
  private readonly __WishlistService=inject(WishlistService);
  private readonly __NgxSpinnerService=inject(NgxSpinnerService);
  productlist: Iproduct[] = [];
  categorylist: Icategory[] = [];
  text:string="";
  getallproducts!: Subscription;
  getallcategories!: Subscription;
  wishlistUserDataId: string[] = [];
  wishlistSubscription!: Subscription;
  customOptionscat: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    autoplay:true,
    autoplayTimeout:1000,
    autoplayHoverPause:true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }
  customOptionsmain: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    autoplay:true,
    autoplayTimeout:1000,
    autoplayHoverPause:true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    items:1,
    nav: false
  }

  ngOnInit(): void {
    this.wishlistSubscription = this.__WishlistService.wishlist$.subscribe(wishlist => {
      this.wishlistUserDataId = wishlist;
    });
    this.__NgxSpinnerService.show();
    this.getallproducts = this.__ProductsService.getallproducts().subscribe({
      next: (res) => {
        console.log(res.data);
        this.productlist = res.data;
        this.__NgxSpinnerService.hide();  
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.getallcategories = this.__CategoryService.getallcategories().subscribe({
      next: (res) => {
        console.log(res.data);
        this.categorylist = res.data;  
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  addtocart(id:string):void {
    this.__CartService.addToCart(id).subscribe({
      next: (res) => {
        console.log(res);
        this.__ToastrService.success(`
          <div >
          <span>it has been added to cart successfuly!</span>
          <span class="text-danger h3">&hearts;</span>
          </div>`,
          '', {
            enableHtml: true,
          closeButton:true,
          progressBar:true,
          progressAnimation:"increasing",
          positionClass:"toast-top-right",
          

        });
        this.__CartService.cartNumber.next(res.numOfCartItems);
        console.log( this.__CartService.cartNumber)
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
          this.wishlistUserDataId.push(id);  // Add product to wishlist
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
    
    this.getallcategories?.unsubscribe();
    this.getallproducts?.unsubscribe();
    
      // Unsubscribe to avoid memory leaks
      if (this.wishlistSubscription) {
        this.wishlistSubscription.unsubscribe();
      }
    }
  }

