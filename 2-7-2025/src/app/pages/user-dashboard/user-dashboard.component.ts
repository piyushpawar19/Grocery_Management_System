import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { GetProductService, Product } from '../../services/get_product_service';
import { AddToCartService } from '../../services/add-to-cart.service';
import { ProductSearchService } from '../../services/product-search.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({  
  selector: 'app-user-dashboard',  
  templateUrl: './user-dashboard.component.html',  
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  @ViewChild('productsSection') productsSection!: ElementRef;
  
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  errorMsg = '';
  showLogoutConfirm = false;
  addedToCartProducts: Set<number> = new Set();
  isSearching = false;
  searchError = '';
  showNoResults = false;
  private logoutSubscription?: Subscription;

  constructor(
    private router: Router, 
    private getProductService: GetProductService,
    private addToCartService: AddToCartService,
    private productSearchService: ProductSearchService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.fetchProducts();
    
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

  scrollToProducts() {
    this.productsSection.nativeElement.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }

  fetchProducts() {
    this.loading = true;
    this.errorMsg = '';
    this.getProductService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.filteredProducts = data;
        this.loading = false;
      },
      error: (err) => {
        this.products = [];
        this.filteredProducts = [];
        this.errorMsg = 'Failed to load products. Please try again.';
        this.loading = false;
      }
    });
  }

  onSearchResults(results: Product[]) {
    this.filteredProducts = results;
    this.showNoResults = results.length === 0 && this.isSearching;
  }

  onSearchError(error: string) {
    this.searchError = error;
    this.filteredProducts = [];
  }

  onSearchLoading(loading: boolean) {
    this.isSearching = loading;
  }

  onClearSearch() {
    console.log('Clear search event received in user dashboard');
    this.filteredProducts = this.products; // Reset to show all products
    this.searchError = ''; // Clear any search errors
    this.showNoResults = false; // Clear no results flag
    this.isSearching = false; // Clear searching flag
  }

  viewProduct(id: number) {
    this.router.navigate(['/product', id]);
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

  addToCart(product: Product) {
    if (product.quantity === 0) {
      return; // Don't add if out of stock
    }

    console.log('Adding product to cart:', product.productId);
    console.log('Customer ID from localStorage:', localStorage.getItem('customerId'));

    this.addToCartService.addToCart(product.productId).subscribe({
      next: (response) => {
        // Mark this product as added to cart
        this.addedToCartProducts.add(product.productId);
        console.log('Product added to cart successfully:', response);
      },
      error: (error) => {
        console.error('Error adding product to cart:', error);
      }
    });
  }

  isAddedToCart(productId: number): boolean {
    return this.addedToCartProducts.has(productId);
  }

  getProductImage(product: Product): string {
    // If product has an imageUrl and it's not empty, use it
    if (product.imageUrl && product.imageUrl.trim() !== '') {
      return product.imageUrl;
    }
    // Fallback to apple image
    return '../../../assets/images/apple.jpg';
  }

  onImageError(event: any): void {
    // If the image fails to load, set it to the fallback image
    event.target.src = '../../../assets/images/apple.jpg';
  }
}