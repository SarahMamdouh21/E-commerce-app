import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,NgClass,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly _AuthService=inject(AuthService);
  private readonly _Router=inject(Router);
  
  msgsuccess:boolean=false;
  msgerror:string="";
  loading:boolean=false;

 loginform: FormGroup = new FormGroup({
   
   email: new FormControl(null, [Validators.required, Validators.email]),
   password: new FormControl(null, [Validators.required, Validators.pattern(/^\w{6,}$/)]),
   
 });

 loginsubmit(): void {
   if(this.loginform.valid){
     
     this.loading=true;
       this._AuthService.setloginform(this.loginform.value).subscribe({
         next:(res)=> {
           console.log(res);
           if(res.message=='success'){
             this.msgsuccess=true;
             setTimeout(() => {
               localStorage.setItem('usertoken',res.token);
               this._AuthService.saveuserdata()

               this._Router.navigate(['/home']);
             }, 1000);

           }
           this.loading=false;
           
         },
         error:(err:HttpErrorResponse)=> {
           this.msgerror= err.error.message
           console.log(err);
           this.loading=false;
         }
       })
   }else{
     this.loginform.markAllAsTouched();
   }
 }
 

}
