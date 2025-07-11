import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  searchText: string = '';

  constructor(private router: Router) {}

  logout() {
    // Implement logout logic
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('customerId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAdmin');
    this.router.navigate(['/']);
  }

  profile() {
    // Navigate to admin profile page
    this.router.navigate(['/admin-dashboard/profile']);
  }
  goTo(route: string) {
    this.router.navigate(["/"]);
  }

  showLogoutConfirm = false;

// Then, add these two methods in the class:

confirmLogout() {
  this.showLogoutConfirm = false;
  // Clear role information
  localStorage.removeItem('username');
  localStorage.removeItem('password');
  localStorage.removeItem('customerId');
  localStorage.removeItem('userRole');
  localStorage.removeItem('isAdmin');
  // Navigate to login/root/home page
  window.location.href = '/';
}

cancelLogout() {
  this.showLogoutConfirm = false;
}

}


