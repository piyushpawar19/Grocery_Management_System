import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserOrderService } from '../../services/userOrder.service';
import { AuthService } from '../../services/auth.service';
import { Order, OrderItem } from '../../shared/interfaces/order.interface';
import { Subscription } from 'rxjs';

@Component({  
  selector: 'app-invoice',  
  templateUrl: './invoice.component.html',  
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit, OnDestroy {
  orderId!: number;
  order: Order | null = null;
  loading = false;
  error = '';
  
  // For logout confirmation
  showLogoutConfirm = false;
  private logoutSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private userOrderService: UserOrderService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Get order ID from route parameters
    const orderIdParam = this.route.snapshot.paramMap.get('orderId');
    if (orderIdParam) {
      this.orderId = parseInt(orderIdParam, 10);
      this.loadOrder();
    } else {
      this.error = 'Order ID not found';
    }
    
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

  loadOrder() {
    this.loading = true;
    this.error = '';
    
    this.userOrderService.getOrderById(this.orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load order details. Please try again.';
        this.loading = false;
        console.error('Error loading order:', err);
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  formatPrice(price: number): string {
    return `₹${price.toFixed(2)}`;
  }

  getTotalItems(): number {
    if (!this.order) return 0;
    return this.order.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  goBack(): void {
    this.router.navigate(['/user-dashboard']);
  }

  back() { 
    this.router.navigate(['/dashboard']); 
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
