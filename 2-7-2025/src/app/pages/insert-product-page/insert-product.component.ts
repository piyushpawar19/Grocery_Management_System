import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';
import { Router } from '@angular/router';
import { InsertProductService } from '../../services/insert_product_service';

@Component({
  selector: 'app-insert-product',
  templateUrl: './insert-product.component.html',
  styleUrls: ['./insert-product.component.css']
})
export class InsertProductComponent implements OnInit {
  productForm!: FormGroup;
  showDialog = false;

  constructor(private fb: FormBuilder, private router: Router, private insertProductService: InsertProductService) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required, Validators.maxLength(30)]],
      productDescription: [''],
      quantity: [0, [Validators.required, Validators.min(0)]],
      imageUrl: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]]
    });
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
    if (field === 'productName' && ctr.errors['maxlength']) {
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
      case 'productName': return 'Product Name';
      case 'productDescription': return 'Description';
      default:
        return field.charAt(0).toUpperCase() + field.slice(1);
    }
  }

  addProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    // Replace with actual adminId logic as needed
    const adminId = 1;
    this.insertProductService.addProduct(this.productForm.value, adminId).subscribe({
      next: (res) => {
        console.log('Product added:', res);
        this.showDialog = true;
      },
      error: (err) => {
        alert('Failed to add product.');
      }
    });
  }

  closeDialog(): void {
    this.showDialog = false;
    this.router.navigate(['/view-product']);
  }

  logout(): void {
    this.router.navigate(['/login-selection']);
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
