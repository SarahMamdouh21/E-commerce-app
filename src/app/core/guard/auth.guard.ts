import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';  // Import Router from Angular

export const authGuard: CanActivateFn = (route, state) => {
  const __Router = inject(Router);
  const __PLATFORM_ID = inject(PLATFORM_ID);
  if(typeof localStorage !== 'undefined'){

    if (isPlatformBrowser(__PLATFORM_ID)) {
      return true;
    } else {
      __Router.navigate(['/login']);  // Use Angular's Router to navigate
      return false;
    }
  }else{
    return false;
  }
};
