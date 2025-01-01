import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageService } from '../Services/local-storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const localStorageService = inject(LocalStorageService);
  const access_token = localStorageService.get('access_token');

  if(access_token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${access_token}`
      }
    })
  }

  return next(req);
};
