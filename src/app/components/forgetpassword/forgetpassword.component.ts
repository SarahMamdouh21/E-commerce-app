import { Router } from '@angular/router';
import { Component, Inject, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../core/service/auth.service';


@Component({
  selector: 'app-forgetpassword',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forgetpassword.component.html',
  styleUrl: './forgetpassword.component.scss'
})
export class ForgetpasswordComponent {
  private readonly __AuthService= inject(AuthService)
  private readonly __Router= inject(Router)
  step:number=1;
  verifyEmail: FormGroup=new FormGroup({
    email:new FormControl ('', [Validators.required, Validators.email]) 
  })
  verifyCode: FormGroup=new FormGroup({
    resetcode:new FormControl ('', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]) 
  })
  resetPass: FormGroup=new FormGroup({
    email:new FormControl ('', [Validators.required, Validators.email]) ,
    resetpass:new FormControl ('', [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z0-9]{5,8}$/)]) 
  })
  verifyEmailsubmit():void{
   let emailValue= this.verifyEmail.get('email')?.value;
   this.resetPass.get('email')?.patchValue(emailValue);

     this.__AuthService.verifyemail(this.verifyEmail.value).subscribe({
       next:(res)=>{
         console.log(res);
         if(res.statusMsg=='success'){
           this.step=2;
         }
       },
       error:(err)=>{
         console.log(err);
       }
     })
  }
  verifyCodesubmit():void{
     this.__AuthService.verifycode(this.verifyCode.value).subscribe({
       next:(res)=>{
         console.log(res);
         if(res.statusMsg=='success'){
           this.step=3;
         }
       },
       error:(err)=>{
         console.log(err);
       }
     })
  }
  resetpasssubmit():void{
     this.__AuthService.resetpass(this.resetPass.value).subscribe({
       next:(res)=>{
         console.log(res);
         localStorage.setItem('usertoken',res.token);
         this.__AuthService.saveuserdata();
         this.__Router.navigate(['/home']);
       },
       error:(err)=>{
         console.log(err);
       }
     })
  }
}
