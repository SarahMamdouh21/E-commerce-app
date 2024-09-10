import { Iproduct } from '../../core/interface/iproduct';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/service/products.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CartService } from '../../core/service/cart.service';
import { WishlistService } from '../../core/service/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CarouselModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit ,OnDestroy{
  private readonly __ActivatedRoute= inject(ActivatedRoute);
  private readonly __ProductsService= inject(ProductsService);
  private readonly __CartService= inject(CartService);
  private readonly __WishlistService= inject(WishlistService);
  private readonly __ToastrService= inject(ToastrService);
  wishlistUserDataId: string[] = [];
  wishlistSubscription!: Subscription;
  detailsproduct:Iproduct |null= null;
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    items:1,
    nav: true
  }
  ngOnInit(): void {
    this.wishlistSubscription = this.__WishlistService.wishlist$.subscribe(wishlist => {
      this.wishlistUserDataId = wishlist;
    });
      this.__ActivatedRoute.paramMap.subscribe({
        next:(data)=>{
         let productId= data.get('id');
         this.__ProductsService.getoneproduct(productId).subscribe({
           next:(res)=>{
             console.log(res.data);
             this.detailsproduct=res.data;
             
           
             
           },
           error:(err)=>{
             console.log(err);
           }
         })
        }
      })
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
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  addToWishlist(id:string):void{
      this.__WishlistService.addProductToWishlist(id).subscribe(
        {
          next: (res) => {
            console.log(res);
            if ('data' in res) {
              this.wishlistUserDataId = res.data || [];
              localStorage.setItem('wishlistUserDataId', JSON.stringify(this.wishlistUserDataId));
              // console.log(this.wishlistUserDataId);
            }
            this.__ToastrService.success(`
          <div >
           
            <span>it has been added to wishlist successfuly!</span>
            <span class="text-danger h3">&hearts;</span>
          </div>`,
          '', {
            enableHtml: true,
          closeButton:true,
          progressBar:true,
          progressAnimation:"increasing",
          positionClass:"toast-top-right",
          

        });
            
             
          },
          error: (err) => {
            console.log(err);
          }
  }
      )
  }
  removeFromWishlist(productId: string) {
    this.__WishlistService.deleteFromWishlist(productId).subscribe({
      next: (res) => {
        if (Array.isArray(res.data)) {
          this.wishlistUserDataId = res.data;
        } else {
          this.wishlistUserDataId = [];
        }
        localStorage.setItem('wishlistUserDataId', JSON.stringify(this.wishlistUserDataId));
        
      },
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    if (this.wishlistSubscription) {
      this.wishlistSubscription.unsubscribe();
    }
  }

}
