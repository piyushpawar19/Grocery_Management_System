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
    this.router.navigate(['/']);
  }

  profile() {
    // Implement logout logic
    this.router.navigate(['/user-dashboard/profile']);
  }
  goTo(route: string) {
    this.router.navigate(["/"]);
  }

  showLogoutConfirm = false;

// Then, add these two methods in the class:

confirmLogout() {
  this.showLogoutConfirm = false;
  // Navigate to login/root/home page
  window.location.href = '/';
}

cancelLogout() {
  this.showLogoutConfirm = false;
}

}


