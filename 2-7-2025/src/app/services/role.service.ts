import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  
  constructor() { }

  getUserRole(): string {
    // Check if user is admin by looking for admin-specific data
    const isAdmin = localStorage.getItem('isAdmin') === 'true' || 
                   localStorage.getItem('userRole') === 'ADMIN' ||
                   localStorage.getItem('role') === 'ADMIN';
    
    return isAdmin ? 'ADMIN' : 'CUSTOMER';
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  isCustomer(): boolean {
    return this.getUserRole() === 'CUSTOMER';
  }

  getDashboardRoute(): string {
    return this.isAdmin() ? '/admin-dashboard' : '/user-dashboard';
  }

  getProfileRoute(): string {
    return this.isAdmin() ? '/admin-dashboard/profile' : '/user-dashboard/profile';
  }
} 