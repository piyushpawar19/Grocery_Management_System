import { Component, OnInit } from '@angular/core';
import { GetProductService } from '../../services/get_product_service';
import { Router } from '@angular/router';

interface Product {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  productDescription: string;
  reserved: string;
  // Add imageUrl if you have it in backend, otherwise use a placeholder
}

@Component({ selector: 'app-home', templateUrl: './home.component.html', styleUrls: ['./home.component.css'] })
export class HomeComponent implements OnInit {
  public products: Product[] = [];
  public showLoginDialog: boolean = false;
  constructor(private getProductService: GetProductService, private router: Router) {}

  ngOnInit() {
    this.getProductService.getAllProducts().subscribe({
      next: (data) => { this.products = data; },
      error: (err) => { this.products = []; }
    });
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