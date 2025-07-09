import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { GetProductService, Product } from '../../services/get_product_service';
import { AddToCartService } from '../../services/add-to-cart.service';

@Component({  
  selector: 'app-user-dashboard',  
  templateUrl: './user-dashboard.component.html',  
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  @ViewChild('productsSection') productsSection!: ElementRef;
  
  products: Product[] = [];
  loading = false;
  errorMsg = '';
  showLogoutConfirm = false;
  addedToCartProducts: Set<number> = new Set();

  constructor(
    private router: Router, 
    private getProductService: GetProductService,
    private addToCartService: AddToCartService
  ) {}

  ngOnInit() {
    this.fetchProducts();
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
        this.loading = false;
      },
      error: (err) => {
        this.products = [];
        this.errorMsg = 'Failed to load products. Please try again.';
        this.loading = false;
      }
    });
  }

  viewProduct(id: number) {
    this.router.navigate(['/product', id]);
  }

  confirmLogout() {
    this.showLogoutConfirm = false;
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    this.router.navigateByUrl('/user-login');
  }

  cancelLogout() {
    this.showLogoutConfirm = false;
  }

  addToCart(product: Product) {
    if (product.quantity === 0) {
      return; // Don't add if out of stock
    }

    this.addToCartService.addToCart(product.productId).subscribe({
      next: (response) => {
        // Mark this product as added to cart
        this.addedToCartProducts.add(product.productId);
        console.log('Product added to cart successfully:', response);
      },
      error: (error) => {
        console.error('Error adding product to cart:', error);
        // You can show an error message to the user here
      }
    });
  }

  isAddedToCart(productId: number): boolean {
    return this.addedToCartProducts.has(productId);
  }
}