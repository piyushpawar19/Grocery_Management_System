import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip adding auth headers for open endpoints
    if (this.isOpenEndpoint(req.url)) {
      return next.handle(req);
    }
    
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    if (username && password) {
      const authHeader = 'Basic ' + btoa(username + ':' + password);
      const authReq = req.clone({
        setHeaders: { Authorization: authHeader }
      });
      return next.handle(authReq);
    }
    return next.handle(req);
  }
  
  private isOpenEndpoint(url: string): boolean {
    // List of endpoints that don't require authentication
    const openEndpoints = [
      '/api/users/me/',  // Profile endpoints with customerId
      '/api/users/register',
      '/api/users/login',
      '/api/products',
      '/password',  // Password change endpoint
      '/api/cart'   // Cart endpoints
    ];
    
    return openEndpoints.some(endpoint => url.includes(endpoint));
  }
} 