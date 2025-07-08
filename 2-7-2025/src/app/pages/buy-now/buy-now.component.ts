import { Location } from '@angular/common';

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-buy-now',
  templateUrl: './buy-now.component.html',
  styleUrls: ['./buy-now.component.css']
})
export class BuyNowComponent {
  form: FormGroup;
  totalItems = 0;
  totalAmount = 0;
  showDialog = false;
  orderId!: number;

  constructor(private fb: FormBuilder, private router: Router,private location: Location) {
    // TODO: replace with real cart service values
    this.totalItems = 5;
    this.totalAmount = 21.99;

    this.form = this.fb.group({
      cardName: ['', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      expiry: ['', [Validators.required, this.expiryValidator]]
    });
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
    this.orderId = Math.floor(Math.random() * 100000);
    this.showDialog = true;
  }

  confirmDialog() {
    this.showDialog = false;
    this.router.navigate(['/invoice', this.orderId]);
  }

  back() {
    this.router.navigate(['invoice']);
  }

  showLogoutConfirm = false;

// Then, add these two methods in the class:

confirmLogout() {
  this.showLogoutConfirm = false;
  // Navigate to login/root/home page
  window.location.href = '/';
}

cancelLogout() {
  this.showLogoutConfirm = false;
}

// Inject and use it in your class:


goBack() {
  this.location.back();
}

}
