import { Component, OnInit, inject } from '@angular/core';
import { WishlistService } from '../../core/service/wishlist.service';
import { Iproduct } from '../../core/interface/iproduct';
import { CurrencyPipe } from '@angular/common';
import { TermtxtPipe } from '../../core/pipe/termtxt.pipe';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/service/cart.service';
import { Icart } from '../../core/interface/icart';
import { ToastrService } from 'ngx-toastr';
import { Data } from '../../core/interface/wishlist';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CurrencyPipe,TermtxtPipe,RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit{
  private readonly __WishlistService=inject(WishlistService);
  private readonly __CartService=inject(CartService);
  private readonly __ToastrService=inject(ToastrService);
  productlist: Iproduct[] = [];
  cartItems:Icart={} as Icart;
  wishlistUserDataId: string[] = [];
  data: Data[] = [];
     ngOnInit(): void {
       this.__WishlistService.getLoggedUserWishlist().subscribe({
         next:(res)=>{
           console.log(res.data);
           this.productlist=res.data;
           
         },
         error:(err)=>{
           console.log(err);
         }
       }
       )
     }
     removeItem(id: string) {
      this.__WishlistService.deleteFromWishlist(id).subscribe({
        next: (res:any) => {
          console.log( res);
          
          this.productlist = this.productlist.filter(product => product._id !== id);
  
          this.wishlistUserDataId = this.productlist.map(product => product._id);
          localStorage.setItem('wishlistUserDataId', JSON.stringify(this.wishlistUserDataId));
    
        
          this.__WishlistService.getLoggedUserWishlist().subscribe({
            next: (res) => {
              this.data = res.data;
            },
          });
        },
        error: (err:any) => {
          console.log( err);
        }
      });
    }
    
addtocart(id:string):void {
  this.__CartService.addToCart(id).subscribe({
    next: (res) => {
      console.log(res);
      this.__CartService.cartNumber.next(res.numOfCartItems);
        console.log( this.__CartService.cartNumber)
      this.removeItem(id)
      
    },
    error: (err) => {
      console.log(err);
    }
  });
}
}
