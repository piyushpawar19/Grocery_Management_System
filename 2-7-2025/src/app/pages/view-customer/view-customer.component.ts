

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { CustomerService, Customer } from '../../services/customer.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.component.html',
  styleUrls: ['./view-customer.component.css']
})
export class ViewCustomerComponent implements OnInit, OnDestroy {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  page = 1;
  perPage = 10;
  loading = false;
  errorMsg = '';
  searchQuery = '';

  // Dialog state
  showConfirmBox = false;
  showSuccessBox = false;
  private selectedCustomerId: number | null = null;

  // For logout confirmation
  showLogoutConfirm = false;
  private logoutSubscription?: Subscription;

  constructor(
    private location: Location,
    private customerService: CustomerService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadCustomers();
    
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

  goBack() {
    this.location.back();
  }

  loadCustomers() {
    this.loading = true;
    this.errorMsg = '';

    this.customerService.getAllCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.filteredCustomers = data;
        this.loading = false;
        console.log('Customers loaded successfully:', data);
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.errorMsg = 'Failed to load customers. Please try again.';
        this.loading = false;
        // Fallback to empty array if API fails
        this.customers = [];
        this.filteredCustomers = [];
      }
    });
  }

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.filteredCustomers = this.customers;
      this.page = 1; // Reset to first page
      return;
    }

    const searchTerm = this.searchQuery.toLowerCase().trim();
    this.filteredCustomers = this.customers.filter(customer => 
      customer.customerName.toLowerCase().includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm) ||
      customer.contactNumber.toString().includes(searchTerm) ||
      customer.address.toLowerCase().includes(searchTerm) ||
      customer.customerId.toString().includes(searchTerm)
    );
    this.page = 1; // Reset to first page when searching
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }

  onClearSearch() {
    this.searchQuery = '';
    this.filteredCustomers = this.customers;
    this.page = 1; // Reset to first page
  }

  // Pagination slice
  get displayed(): Customer[] {
    const start = (this.page - 1) * this.perPage;
    return this.filteredCustomers.slice(start, start + this.perPage);
  }

  // Start delete flow
  delete(id: number) {
    this.selectedCustomerId = id;
    this.showConfirmBox = true;
  }

  // User confirms deletion
  confirmDelete() {
    if (this.selectedCustomerId !== null) {
      this.customers = this.customers.filter(
        c => c.customerId !== this.selectedCustomerId
      );
      this.filteredCustomers = this.filteredCustomers.filter(
        c => c.customerId !== this.selectedCustomerId
      );
      this.selectedCustomerId = null;
      this.showConfirmBox = false;
      this.showSuccessBox = true;
    }
  }

  // User cancels deletion
  cancelDelete() {
    this.selectedCustomerId = null;
    this.showConfirmBox = false;
  }

  // Close the success dialog
  closeSuccess() {
    this.showSuccessBox = false;
  }

  // Pagination controls
  prev() {
    if (this.page > 1) {
      this.page--;
    }
  }

  next() {
    if (this.page * this.perPage < this.filteredCustomers.length) {
      this.page++;
    }
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
