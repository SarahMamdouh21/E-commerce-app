import { Icart } from './../../core/interface/icart';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { CartService } from '../../core/service/cart.service';

import { CurrencyPipe } from '@angular/common';
import { TermtxtPipe } from '../../core/pipe/termtxt.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe,TermtxtPipe,RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit{
  private readonly __HttpClient=inject(HttpClient);
  private readonly __CartService=inject(CartService);
  
  
  cartItems:Icart={} as Icart;

  ngOnInit(): void {

   
  this.__CartService.getCart().subscribe({
    next:(res)=>{
      console.log(res.data);
      this.cartItems=res.data;
    },
    error:(error)=>{
      console.log(error);
    }
  })
  }
  removeItem(id:string):void{
        this.__CartService.deleteFromCart(id).subscribe({
          next:(res)=>{
            console.log(res);
            this.cartItems=res.data;
            this.__CartService.cartNumber.next(res.numOfCartItems);
          },
          error:(error)=>{
            console.log(error);
          }
        })
  }
  updateItem(id:string,count:number):void{
    if(count>0){
      
      this.__CartService.updateCart(id,count).subscribe({
        next:(res)=>{
          console.log(res);
          this.cartItems=res.data;
        },
        error:(error)=>{
          console.log(error);
        }
      })
}
    }
  clearItems():void{
    
      
      this.__CartService.clearCart().subscribe({
        next:(res)=>{
          console.log(res);
          if(res.message=='success'){

            this.cartItems= {}as Icart;
            this.__CartService.cartNumber.next(0);

          }
        },
        error:(error)=>{
          console.log(error);
        }
      })

    }


    get totalProducts(): number {
      return this.cartItems.products?.reduce((acc, item) => acc + item.count, 0) || 0;
    }

}
