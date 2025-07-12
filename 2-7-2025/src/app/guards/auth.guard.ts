import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      console.log('AuthGuard: User not logged in, redirecting to login');
      this.router.navigate(['/login-selection']);
      return false;
    }

    // Check if route requires specific role
    const requiredRole = route.data['role'];
    if (requiredRole) {
      if (!this.authService.hasRole(requiredRole)) {
        console.log(`AuthGuard: User doesn't have required role ${requiredRole}`);
        this.router.navigate(['/']);
        return false;
      }
    }

    // Check if route requires admin role specifically
    const requiresAdmin = route.data['requiresAdmin'];
    if (requiresAdmin && !this.authService.isAdmin()) {
      console.log('AuthGuard: Route requires admin access');
      this.router.navigate(['/']);
      return false;
    }

    console.log('AuthGuard: Access granted');
    return true;
  }
} 