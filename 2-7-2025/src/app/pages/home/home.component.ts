import { Component, OnInit } from '@angular/core';
import { GetProductService } from '../../services/get_product_service';

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
  constructor(private getProductService: GetProductService) {}
  ngOnInit() {
    this.getProductService.getAllProducts().subscribe({
      next: (data) => { this.products = data; },
      error: (err) => { this.products = []; }
    });
  }
}