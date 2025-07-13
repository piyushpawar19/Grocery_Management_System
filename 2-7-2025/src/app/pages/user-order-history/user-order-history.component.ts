import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserOrderService } from '../../services/userOrder.service';
import { Order } from '../../shared/interfaces/order.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-order-history',
  templateUrl: './user-order-history.component.html',
  styleUrls: ['./user-order-history.component.css']
})
export class UserOrderHistoryComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  loading = false;
  error = '';
  showLogoutConfirm = false;
  searchQuery = '';
  private logoutSubscription?: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userOrderService: UserOrderService
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
    
    // Get customer ID using AuthService
    const customerId = this.authService.getCustomerId();
    if (!customerId) {
      this.error = 'User information not found. Please login again.';
      this.loading = false;
      return;
    }
    
    this.userOrderService.getUserOrders(customerId).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.filteredOrders = orders;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders. Please try again.';
        this.loading = false;
        console.error('Error loading orders:', err);
      }
    });
  }

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.filteredOrders = this.orders;
      return;
    }

    const searchTerm = this.searchQuery.toLowerCase().trim();
    this.filteredOrders = this.orders.filter(order => 
      order.id.toString().includes(searchTerm) ||
      order.orderTime.toLowerCase().includes(searchTerm) ||
      order.totalAmount.toString().includes(searchTerm) ||
      order.items.some(item => 
        item.productName.toLowerCase().includes(searchTerm) ||
        item.quantity.toString().includes(searchTerm) ||
        item.price.toString().includes(searchTerm)
      )
    );
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }

  onClearSearch() {
    this.searchQuery = '';
    this.filteredOrders = this.orders;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  formatPrice(price: number): string {
    return `₹${price.toFixed(2)}`;
  }

  viewInvoice(orderId: number) {
    this.router.navigate(['/invoice', orderId]);
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