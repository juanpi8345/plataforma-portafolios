import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const employeeGuard: CanActivateFn = (_route, state) => {
  let isLogged : boolean = inject(AuthService).isLoggedIn();
  let role : string = inject(AuthService).getUserRol();
  if(isLogged && role === "EMPLOYEE")
    return true;
  else{
    inject(Router).navigate(['login']);
    return false;
  }
};
