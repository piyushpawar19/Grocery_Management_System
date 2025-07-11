

import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CustomerService, Customer } from '../../services/customer.service';

@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.component.html',
  styleUrls: ['./view-customer.component.css']
})
export class ViewCustomerComponent implements OnInit {
  customers: Customer[] = [];
  page = 1;
  perPage = 10;
  loading = false;
  errorMsg = '';

  // Dialog state
  showConfirmBox = false;
  showSuccessBox = false;
  private selectedCustomerId: number | null = null;

  constructor(
    private location: Location,
    private customerService: CustomerService
  ) {}

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.loading = true;
    this.errorMsg = '';

    this.customerService.getAllCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.loading = false;
        console.log('Customers loaded successfully:', data);
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.errorMsg = 'Failed to load customers. Please try again.';
        this.loading = false;
        // Fallback to empty array if API fails
        this.customers = [];
      }
    });
  }

  // Pagination slice
  get displayed(): Customer[] {
    const start = (this.page - 1) * this.perPage;
    return this.customers.slice(start, start + this.perPage);
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
    if (this.page * this.perPage < this.customers.length) {
      this.page++;
    }
  }

  showLogoutConfirm = false;

  confirmLogout() {
    this.showLogoutConfirm = false;
    // Navigate to login/root/home page
    window.location.href = '/';
  }

  cancelLogout() {
    this.showLogoutConfirm = false;
  }
}
