import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';
import { UpdateProductService, ProductDto, UpdateProductRequest } from '../../services/update-product-service';

interface Product {
  id: number; name: string; description: string;
  quantity: number; imageUrl: string; price: number;
}

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {
  product!: Product;
  productForm!: FormGroup;
  showDialog = false;
  showErrorDialog = false;
  dialogMessage = '';
  errorMessage = '';
  productId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private updateProductService: UpdateProductService
  ) {}

  ngOnInit() {
    this.productId = +this.route.snapshot.params['id'];
    
    // Initialize form with validations similar to insert product
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      description: [''],
      quantity: [0, [Validators.required, Validators.min(0)]],
      imageUrl: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]]
    });

    // Load product data from backend
    this.loadProductData();
  }

  loadProductData(): void {
    this.updateProductService.getProduct(this.productId).subscribe({
      next: (product: ProductDto) => {
        this.product = {
          id: product.id!,
          name: product.name,
          description: product.description,
          quantity: product.quantity,
          imageUrl: product.imageUrl,
          price: product.price
        };
        
        // Update form with product data
        this.productForm.patchValue({
          name: this.product.name,
          description: this.product.description,
          quantity: this.product.quantity,
          imageUrl: this.product.imageUrl,
          price: this.product.price
        });
      },
      error: (err: any) => {
        console.error('Error loading product:', err);
        // Fallback to localStorage if backend fails
        this.loadFromLocalStorage();
      }
    });
  }

  loadFromLocalStorage(): void {
    const all: Product[] = JSON.parse(localStorage.getItem('products')||'[]');
    this.product = all.find(p => p.id === this.productId)!;
    
    if (this.product) {
      this.productForm.patchValue({
        name: this.product.name,
        description: this.product.description,
        quantity: this.product.quantity,
        imageUrl: this.product.imageUrl,
        price: this.product.price
      });
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.productForm.controls;
  }

  isInvalid(field: string): boolean {
    const ctr = this.f[field];
    return ctr.invalid && (ctr.touched || ctr.dirty);
  }

  getErrorMsg(field: string): string {
    const ctr = this.f[field];
    if (!ctr.errors) return '';

    if (ctr.errors['required']) {
      return `${this.label(field)} is required.`;
    }
    if (field === 'name' && ctr.errors['maxlength']) {
      return `Name cannot exceed ${ctr.errors['maxlength'].requiredLength} characters.`;
    }
    if ((field === 'quantity' || field === 'price') && ctr.errors['min'] !== undefined) {
      return `${this.label(field)} cannot be negative.`;
    }
    return '';
  }

  private label(field: string): string {
    switch (field) {
      case 'imageUrl': return 'Image URL';
      case 'quantity': return 'Quantity';
      case 'name': return 'Product Name';
      case 'description': return 'Description';
      default:
        return field.charAt(0).toUpperCase() + field.slice(1);
    }
  }

  save() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const updateData: UpdateProductRequest = {
      name: this.productForm.value.name,
      description: this.productForm.value.description,
      quantity: this.productForm.value.quantity,
      imageUrl: this.productForm.value.imageUrl,
      price: this.productForm.value.price
    };

    this.updateProductService.updateProduct(this.productId, updateData).subscribe({
      next: (response: any) => {
        console.log('Product updated successfully:', response);
        this.dialogMessage = 'Product updated successfully!';
        this.showDialog = true;
        
        // Also update localStorage for consistency
        this.updateLocalStorage(updateData);
      },
      error: (err: any) => {
        console.error('Error updating product:', err);
        this.errorMessage = err.error?.message || err.message || 'Failed to update product. Please try again.';
        this.showErrorDialog = true;
      }
    });
  }

  updateLocalStorage(updateData: UpdateProductRequest): void {
    const all: Product[] = JSON.parse(localStorage.getItem('products')||'[]');
    const idx = all.findIndex(p => p.id === this.productId);
    if (idx > -1) {
      all[idx] = { ...all[idx], ...updateData };
      localStorage.setItem('products', JSON.stringify(all));
    }
  }

  closeDialog(): void {
    this.showDialog = false;
    this.router.navigate(['/admin/view-product']);
  }

  closeErrorDialog(): void {
    this.showErrorDialog = false;
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

