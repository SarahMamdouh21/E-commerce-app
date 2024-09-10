import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/service/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,NgClass],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
   private readonly _AuthService=inject(AuthService);
   private readonly _Router=inject(Router);
   
   msgsuccess:boolean=false;
   msgerror:string="";
   loading:boolean=false;
   registersub!:Subscription;

  registerform: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(8)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z0-9]{5,8}$/)]),
    rePassword: new FormControl(null),
    phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)])
  },this.confirmpassword);

  registersubmit(): void {
    if(this.registerform.valid){
      
      this.loading=true;
        this.registersub= this._AuthService.setregisterform(this.registerform.value).subscribe({
          next:(res)=> {
            console.log(res);
            if(res.message=='success'){
              this.msgsuccess=true;
              setTimeout(() => {
                this._Router.navigate(['/login']);
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
      this.registerform.markAllAsTouched();
    }
  }
  ngOnDestroy(): void {
    this.registersub?.unsubscribe();
    
  }
  confirmpassword(g:AbstractControl){
    if(g.get('password')?.value=== g.get('rePassword')?.value){
          return null;
        
    }else{

      return {'mismatch':true}
    }

  }
}
