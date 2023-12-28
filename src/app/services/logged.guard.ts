import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const loggedGuard: CanActivateFn = (route, state) => {
  if(inject(AuthService).isLoggedIn()){
    inject(Router).navigate(['employee/profile'])
    return false
  }else{
    return true;
  }
};
