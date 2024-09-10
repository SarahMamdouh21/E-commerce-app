import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../core/service/orders.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [ReactiveFormsModule,NgClass],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit{
  private readonly __ActivatedRoute=inject(ActivatedRoute)
  private readonly __OrdersService=inject(OrdersService)
  orders:FormGroup= new FormGroup({
    details:new FormControl(null,[Validators.required]),
    phone:new FormControl(null,[Validators.required]),
    city:new FormControl(null,[Validators.required])

  })
  cartid:string | null="";
  ngOnInit(): void {
    this.__ActivatedRoute.paramMap.subscribe({
      next:(params)=>{
       this.cartid = params.get('idCart');
       console.log(this.cartid);
      },
      error:(error)=>{
        console.log(error);
      }
    })
    
  }
  orderSubmit():void{
    this.__OrdersService.checkout(this.cartid,this.orders.value).subscribe({
      next:(res)=>{
        console.log(res);
        if(res.status=='success'){
            window.open(res.session.url,'_self');
        }
      },
      error:(error)=>{
        console.log(error);
      }
    })
    console.log(this.orders.value);
  }
}

    