import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { PlaceOrderService, OrderRequest } from '../../services/place-order.service';

@Component({
  selector: 'app-buy-now',
  templateUrl: './buy-now.component.html',
  styleUrls: ['./buy-now.component.css']
})
export class BuyNowComponent implements OnInit {
  form: FormGroup;
  totalItems = 0;
  totalAmount = 0;
  showDialog = false;
  orderId!: number;
  loading = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private location: Location,
    private placeOrderService: PlaceOrderService
  ) {
    this.form = this.fb.group({
      cardName: ['', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      expiry: ['', [Validators.required, this.expiryValidator]]
    });
  }

  ngOnInit() {
    // Get cart data from localStorage or set defaults
    const cartData = localStorage.getItem('cartData');
    if (cartData) {
      const cart = JSON.parse(cartData);
      this.totalItems = cart.totalItems || 0;
      this.totalAmount = cart.totalAmount || 0;
    } else {
      // Fallback to defaults if no cart data
      this.totalItems = 0;
      this.totalAmount = 0;
    }
  }

  expiryValidator(control: AbstractControl) {
    if (!/^\d{2}\/\d{2}$/.test(control.value)) return { invalidFormat: true };
    const [mm, yy] = control.value.split('/').map((v: string) => parseInt(v, 10));
    const expiry = new Date(2000 + yy, mm - 1, 1);
    const now = new Date();
    return expiry < new Date(now.getFullYear(), now.getMonth(), 1) ? { expired: true } : null;
  }

  placeOrder() {
    if (this.form.invalid) return;

    this.loading = true;
    this.errorMsg = '';

    const orderRequest: OrderRequest = {
      cardHolderName: this.form.get('cardName')?.value,
      cardNumber: this.form.get('cardNumber')?.value,
      cvv: this.form.get('cvv')?.value,
      expiryDate: this.form.get('expiry')?.value,
      totalItems: this.totalItems,
      totalAmount: this.totalAmount
    };

    this.placeOrderService.placeOrder(orderRequest).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.orderId = response.orderId || Math.floor(Math.random() * 100000);
          this.showDialog = true;
          // Clear cart data after successful order
          localStorage.removeItem('cartData');
        } else {
          this.errorMsg = response.message || 'Failed to place order';
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error placing order:', error);
        this.errorMsg = 'Failed to place order. Please try again.';
      }
    });
  }

  confirmDialog() {
    this.showDialog = false;
    this.router.navigate(['/invoice', this.orderId]);
  }

  back() {
    this.router.navigate(['invoice']);
  }

  showLogoutConfirm = false;

  confirmLogout() {
    this.showLogoutConfirm = false;
    // Navigate to login/root/home page
    window.location.href = '/';
  }

  cancelLogout() {
    this.showLogoutConfirm = false;
  }

  goBack() {
    this.location.back();
  }
}
