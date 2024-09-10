import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const logedGuard: CanActivateFn = (route, state) => {
  const __Router = inject(Router);  
  const __PLATFORM_ID = inject(PLATFORM_ID);  
  if(isPlatformBrowser(__PLATFORM_ID)){
    if (localStorage.getItem('usertoken') !== null) {
      __Router.navigate(['/home']);  
      return false;
    } else {
      return true;
    }
  }else{
    return true;
  }
};
