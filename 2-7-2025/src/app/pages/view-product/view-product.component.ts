

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetProductService } from '../../services/get_product_service';
import { DeleteProductService } from '../../services/delete_product_service';

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
export class ViewProductComponent implements OnInit {
  allProducts: Product[] = [];
  page = 1;
  perPage = 10;

  // For delete confirmation
  showConfirm = false;
  selectedToDelete!: number;

  // For post-delete success dialog
  showDeletedDialog = false;

  constructor(
    private router: Router,
    private getProductService: GetProductService,
    private deleteProductService: DeleteProductService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.getProductService.getAllProducts().subscribe({
      next: (data) => { this.allProducts = data; },
      error: (err) => { this.allProducts = []; }
    });
  }

  get displayed() {
    const start = (this.page - 1) * this.perPage;
    return this.allProducts.slice(start, start + this.perPage);
  }

  // Called when click Delete button
  delete(productId: number) {
    this.selectedToDelete = productId;
    this.showConfirm = true;
  }

  // User clicked “Yes” in confirmation
  confirmDelete() {
    this.deleteProductService.deleteProduct(this.selectedToDelete).subscribe({
      next: () => {
        this.showConfirm = false;
        this.showDeletedDialog = true;
        this.loadProducts();
      },
      error: () => {
        this.showConfirm = false;
        alert('Failed to delete product.');
      }
    });
  }

  // User clicked “No” in confirmation
  cancelDelete() {
    this.showConfirm = false;
  }

  // User clicked OK in deleted-success dialog
  closeDeletedDialog() {
    this.showDeletedDialog = false;
  }

  update(productId: number) {
    this.router.navigate(['/admin/update-product', productId]);
  }

  prev() {
    if (this.page > 1) this.page--;
  }

  next() {
    if (this.page * this.perPage < this.allProducts.length) this.page++;
  }

  showLogoutConfirm = false;

  confirmLogout() {
    this.showLogoutConfirm = false;
    window.location.href = '/';
  }

  cancelLogout() {
    this.showLogoutConfirm = false;
  }
}


