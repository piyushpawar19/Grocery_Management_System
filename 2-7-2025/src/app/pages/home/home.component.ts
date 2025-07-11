import { Component, OnInit } from '@angular/core';
import { GetProductService } from '../../services/get_product_service';
import { Router } from '@angular/router';
import { ProductSearchService, Product } from '../../services/product-search.service';

// Removed local interface Product

@Component({ selector: 'app-home', templateUrl: './home.component.html', styleUrls: ['./home.component.css'] })
export class HomeComponent implements OnInit {
  public products: Product[] = [];
  public filteredProducts: Product[] = [];
  public showLoginDialog: boolean = false;
  public isSearching = false;
  public searchError = '';
  public showNoResults = false;

  constructor(
    private getProductService: GetProductService, 
    private router: Router,
    private productSearchService: ProductSearchService
  ) {}

  ngOnInit() {
    this.loadAllProducts();
  }

  loadAllProducts() {
    this.getProductService.getAllProducts().subscribe({
      next: (data: Product[]) => { 
        this.products = data; 
        this.filteredProducts = data;
      },
      error: (err) => { 
        this.products = []; 
        this.filteredProducts = [];
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
    this.filteredProducts = this.products; // Reset to show all products
    this.searchError = ''; // Clear any search errors
    this.showNoResults = false; // Clear no results flag
    this.isSearching = false; // Clear searching flag
  }

  onAddToCart() {
    this.showLoginDialog = true;
  }

  closeDialog() {
    this.showLoginDialog = false;
  }

  goToLoginSelection() {
    this.router.navigate(['/login-selection']);
    this.closeDialog();
  }
}