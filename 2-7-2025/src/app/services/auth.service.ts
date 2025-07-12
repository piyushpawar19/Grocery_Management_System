import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:9090/api/users';
  
  // Subject for logout confirmation
  private logoutConfirmationSubject = new Subject<boolean>();
  public logoutConfirmation$ = this.logoutConfirmationSubject.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  /**
   * Check if user is logged in by verifying customerId exists in localStorage
   */
  isLoggedIn(): boolean {
    const customerId = localStorage.getItem('customerId');
    const email = localStorage.getItem('email');
    return !!(customerId && email);
  }

  /**
   * Get current user's customer ID
   */
  getCustomerId(): number | null {
    const customerId = localStorage.getItem('customerId');
    return customerId ? parseInt(customerId, 10) : null;
  }

  /**
   * Get current user's email
   */
  getEmail(): string | null {
    return localStorage.getItem('email');
  }

  /**
   * Get current user's role
   */
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  /**
   * Check if current user is admin
   */
  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  /**
   * Store login data in localStorage
   */
  setLoginData(data: any): void {
    if (data.customerId) {
      localStorage.setItem('customerId', data.customerId.toString());
    }
    if (data.email) {
      localStorage.setItem('email', data.email);
    }
    if (data.userRole) {
      localStorage.setItem('userRole', data.userRole);
    }
    if (data.customerName) {
      localStorage.setItem('customerName', data.customerName);
    }
  }

  /**
   * Request logout confirmation
   */
  requestLogout(): void {
    this.logoutConfirmationSubject.next(true);
  }

  /**
   * Confirm logout and proceed
   */
  confirmLogout(): void {
    this.performLogout();
  }

  /**
   * Cancel logout
   */
  cancelLogout(): void {
    this.logoutConfirmationSubject.next(false);
  }

  /**
   * Clear all session data and logout
   */
  private performLogout(): void {
    const email = this.getEmail();
    
    // Clear all session-related data from localStorage
    localStorage.removeItem('customerId');
    localStorage.removeItem('email');
    localStorage.removeItem('userRole');
    localStorage.removeItem('customerName');
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('isAdmin');

    // Optional: Send logout request to backend
    if (email) {
      this.sendLogoutRequest(email).subscribe({
        next: () => console.log('Backend logout successful'),
        error: (err) => console.error('Backend logout failed:', err)
      });
    }

    // Redirect to home page
    this.router.navigate(['/']);
  }

  /**
   * Legacy logout method (for backward compatibility)
   */
  logout(): void {
    this.requestLogout();
  }

  /**
   * Send logout request to backend
   */
  private sendLogoutRequest(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout?email=${encodeURIComponent(email)}`, {});
  }

  /**
   * Check if user has required role for a route
   */
  hasRole(requiredRole: string): boolean {
    const userRole = this.getUserRole();
    return userRole === requiredRole;
  }

  /**
   * Get user's display name
   */
  getUserDisplayName(): string {
    return localStorage.getItem('customerName') || 'User';
  }
} 