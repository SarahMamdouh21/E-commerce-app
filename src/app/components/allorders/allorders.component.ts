import { Component } from '@angular/core';
import { OrdersService } from '../../core/service/orders.service';
import { Allorders } from '../../core/interface/allorders';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CartService } from '../../core/service/cart.service';
import { Icart } from '../../core/interface/icart';

@Component({
  selector: 'app-allorders',
  standalone: true,
  imports: [DatePipe,CurrencyPipe],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.scss'
})
export class AllordersComponent {
  userId = localStorage.getItem('userId')!;
  isLoading: boolean = false;
  allordersList!:Allorders[]|[];
  cartItems:Icart={} as Icart;


  constructor(private _OrderService: OrdersService,private _CartService: CartService) {}

  ngOnInit(): void {
    if (typeof localStorage != 'undefined') {
      localStorage.setItem('currentPage', '/allorders');
    }

    this.getAllOrders();
  }

  getAllOrders() {
   
    this._OrderService.allOrders(this.userId).subscribe({
      next: (res) => {
        this.allordersList = res;

        this.allordersList.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        // console.log(this.allordersList);
       
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }
  get totalProducts(): number {
    return this.cartItems.products?.reduce((acc, item) => acc + item.count, 0) || 0;
  }

}
