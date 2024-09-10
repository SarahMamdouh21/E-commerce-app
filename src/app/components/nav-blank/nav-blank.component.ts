import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { CartService } from '../../core/service/cart.service';

@Component({
  selector: 'app-nav-blank',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './nav-blank.component.html',
  styleUrl: './nav-blank.component.scss'
})
export class NavBlankComponent implements OnInit{
   readonly __AuthService =inject(AuthService)
   readonly __CartService =inject(CartService)
   count:number=0;


     ngOnInit(): void {
      this.__CartService.getCart().subscribe({
        next:(res)=>{
          console.log(res);
          this.__CartService.cartNumber.next(res.numOfCartItems)
        }
      }) // call to get cart number on init
        this.__CartService.cartNumber.subscribe({
          next:(res)=>{
            this.count=res
          }
        })
     }
}
