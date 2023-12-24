import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';



export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

  let authReq = req;
  const token = inject(AuthService).getToken();
  if(token != null){
    authReq = authReq.clone({
      setHeaders: { 'Authorization': 'Bearer ' + token}
    });
  }
  return next(authReq);
};
