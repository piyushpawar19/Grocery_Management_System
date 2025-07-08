

import { Component, OnInit } from '@angular/core';
import customersData from './customer.json';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.component.html',
  styleUrls: ['./view-customer.component.css']
})
export class ViewCustomerComponent implements OnInit {
  allCustomers: Customer[] = [];
  page = 1;
  perPage = 10;

  // Dialog state
  showConfirmBox = false;
  showSuccessBox = false;
  private selectedCustomerId: number | null = null;

  ngOnInit() {
    // Load static JSON data
    this.allCustomers = customersData;
  }

  // Pagination slice
  get displayed(): Customer[] {
    const start = (this.page - 1) * this.perPage;
    return this.allCustomers.slice(start, start + this.perPage);
  }

  // Start delete flow
  delete(id: number) {
    this.selectedCustomerId = id;
    this.showConfirmBox = true;
  }

  // User confirms deletion
  confirmDelete() {
    if (this.selectedCustomerId !== null) {
      this.allCustomers = this.allCustomers.filter(
        c => c.id !== this.selectedCustomerId
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
    if (this.page * this.perPage < this.allCustomers.length) {
      this.page++;
    }
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
