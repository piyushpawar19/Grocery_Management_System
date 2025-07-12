import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminOrderService, Order } from '../../services/adminOrder_service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-order-history',
  templateUrl: './admin-order-history.component.html',
  styleUrls: ['./admin-order-history.component.css']
})
export class AdminOrderHistoryComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  loading = false;
  error = '';
  showLogoutConfirm = false;
  private logoutSubscription?: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private adminOrderService: AdminOrderService
  ) {}

  ngOnInit() {
    this.loadOrders();
    
    // Subscribe to logout confirmation requests
    this.logoutSubscription = this.authService.logoutConfirmation$.subscribe(
      (showDialog) => {
        this.showLogoutConfirm = showDialog;
      }
    );
  }

  ngOnDestroy() {
    // Clean up subscription
    if (this.logoutSubscription) {
      this.logoutSubscription.unsubscribe();
    }
  }

  loadOrders() {
    this.loading = true;
    this.error = '';
    
    this.adminOrderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders. Please try again.';
        this.loading = false;
        console.error('Error loading orders:', err);
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  formatPrice(price: number): string {
    return `₹${price.toFixed(2)}`;
  }

  logout() {
    this.authService.requestLogout();
  }

  confirmLogout() {
    this.showLogoutConfirm = false;
    this.authService.confirmLogout();
  }

  cancelLogout() {
    this.showLogoutConfirm = false;
    this.authService.cancelLogout();
  }
} 