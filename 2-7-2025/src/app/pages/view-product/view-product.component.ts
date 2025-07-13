

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { GetProductService } from '../../services/get_product_service';
import { DeleteProductService } from '../../services/delete_product_service';
import { ProductSearchService } from '../../services/product-search.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

interface Product {
  productId: number;
  productName: string;
  productDescription: string;
  price: number;
  quantity: number;
  reserved: string;
}

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit, OnDestroy {
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  page = 1;
  perPage = 10;

  // For delete confirmation
  showConfirm = false;
  selectedToDelete!: number;

  // For post-delete success dialog
  showDeletedDialog = false;

  // For error dialog
  showErrorDialog = false;
  errorMessage = '';

  // For search functionality
  isSearching = false;
  searchError = '';
  showNoResults = false;

  // For logout confirmation
  showLogoutConfirm = false;
  private logoutSubscription?: Subscription;

  constructor(
    private router: Router,
    private location: Location,
    private getProductService: GetProductService,
    private deleteProductService: DeleteProductService,
    private productSearchService: ProductSearchService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadProducts();
    
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

  loadProducts() {
    this.getProductService.getAllProducts().subscribe({
      next: (data) => { 
        this.allProducts = data; 
        this.filteredProducts = data;
      },
      error: (err) => { 
        this.allProducts = []; 
        this.filteredProducts = [];
      }
    });
  }

  get displayed() {
    const start = (this.page - 1) * this.perPage;
    return this.filteredProducts.slice(start, start + this.perPage);
  }

  onSearchResults(results: Product[]) {
    this.filteredProducts = results;
    this.showNoResults = results.length === 0 && this.isSearching;
    this.page = 1; // Reset to first page when searching
  }

  onSearchError(error: string) {
    this.searchError = error;
    this.filteredProducts = [];
  }

  onSearchLoading(loading: boolean) {
    this.isSearching = loading;
  }

  onClearSearch() {
    this.filteredProducts = this.allProducts; // Reset to show all products
    this.searchError = ''; // Clear any search errors
    this.showNoResults = false; // Clear no results flag
    this.isSearching = false; // Clear searching flag
    this.page = 1; // Reset to first page
  }

  // Called when click Delete button
  delete(productId: number) {
    this.selectedToDelete = productId;
    this.showConfirm = true;
  }

  // User clicked "Yes" in confirmation
  confirmDelete() {
    this.deleteProductService.deleteProduct(this.selectedToDelete).subscribe({
      next: (response) => {
        console.log('Delete response:', response);
        this.showConfirm = false;
        this.showDeletedDialog = true;
        this.loadProducts();
      },
      error: (error) => {
        console.error('Delete error:', error);
        this.showConfirm = false;
        this.errorMessage = 'Failed to delete product. Please try again.';
        this.showErrorDialog = true;
      }
    });
  }

  // User clicked "No" in confirmation
  cancelDelete() {
    this.showConfirm = false;
  }

  // User clicked OK in deleted-success dialog
  closeDeletedDialog() {
    this.showDeletedDialog = false;
  }

  // User clicked OK in error dialog
  closeErrorDialog() {
    this.showErrorDialog = false;
  }

  update(productId: number) {
    this.router.navigate(['/admin/update-product', productId]);
  }

  prev() {
    if (this.page > 1) this.page--;
  }

  next() {
    if (this.page * this.perPage < this.filteredProducts.length) this.page++;
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

  goBack() {
    this.location.back();
  }
}


