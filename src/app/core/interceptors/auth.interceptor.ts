import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Get the token we saved during login
  const token = localStorage.getItem('access_token');

  // 2. If a token exists, clone the request and attach the Bearer header
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Send the modified request to the backend
    return next(authReq);
  }

  // 3. If there is no token (e.g., during login), just send the normal request
  return next(req);
};