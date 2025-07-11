import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { PlaceOrderService, OrderRequest } from '../../services/place-order.service';
import { PaymentMockService, PaymentDetails } from '../../services/payment-mock.service';

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
  showErrorDialog = false;
  showValidationErrorDialog = false;
  orderId!: number;
  loading = false;
  errorMsg = '';
  dialogMessage = '';
  currentYear = new Date().getFullYear();
  years: number[] = [];

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private location: Location,
    private placeOrderService: PlaceOrderService,
    private paymentMockService: PaymentMockService
  ) {
    // Generate years array (current year to current year + 10)
    for (let i = 0; i <= 10; i++) {
      this.years.push(this.currentYear + i);
    }

    this.form = this.fb.group({
      cardName: ['', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      expiryMonth: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
      expiryYear: ['', [Validators.required, Validators.min(this.currentYear), Validators.max(this.currentYear + 10)]]
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

  // Prevent non-numeric input for card number
  onCardNumberKeyPress(event: KeyboardEvent): void {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // Prevent non-numeric input for CVV
  onCvvKeyPress(event: KeyboardEvent): void {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // Get error message for a specific field
  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) {
      return `${this.getFieldLabel(fieldName)} is required.`;
    }
    if (control.errors['pattern']) {
      switch (fieldName) {
        case 'cardNumber':
          return 'Card number must be 16 digits.';
        case 'cvv':
          return 'CVV must be 3 digits.';
        case 'cardName':
          return 'Name must contain letters only.';
        default:
          return `${this.getFieldLabel(fieldName)} format is invalid.`;
      }
    }
    if (control.errors['min'] || control.errors['max']) {
      switch (fieldName) {
        case 'expiryMonth':
          return 'Month must be between 1 and 12.';
        case 'expiryYear':
          return `Year cannot exceed ${this.currentYear + 10}.`;
        default:
          return `${this.getFieldLabel(fieldName)} value is out of range.`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    switch (fieldName) {
      case 'cardName': return 'Card holder name';
      case 'cardNumber': return 'Card number';
      case 'cvv': return 'CVV';
      case 'expiryMonth': return 'Expiry month';
      case 'expiryYear': return 'Expiry year';
      default: return fieldName;
    }
  }

  // Check if a field is invalid and touched
  isFieldInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return control ? control.invalid && control.touched : false;
  }

  // Debug method to check payment validation
  debugPaymentValidation() {
    const paymentDetails: PaymentDetails = {
      name: this.form.get('cardName')?.value,
      cardNumber: this.form.get('cardNumber')?.value,
      cvv: this.form.get('cvv')?.value,
      expiryMonth: this.form.get('expiryMonth')?.value,
      expiryYear: this.form.get('expiryYear')?.value
    };
    
    console.log('=== PAYMENT VALIDATION DEBUG ===');
    console.log('Payment details being validated:', paymentDetails);
    console.log('Form expiryMonth type:', typeof paymentDetails.expiryMonth);
    console.log('Form expiryYear type:', typeof paymentDetails.expiryYear);
    console.log('Sample payments available:', this.paymentMockService.getSamplePayments());
    
    // Check each sample payment individually
    const samplePayments = this.paymentMockService.getSamplePayments();
    samplePayments.forEach((sample, index) => {
      const nameMatch = sample.name.toLowerCase() === paymentDetails.name.toLowerCase();
      const cardMatch = sample.cardNumber === paymentDetails.cardNumber;
      const cvvMatch = sample.cvv === paymentDetails.cvv;
      const monthMatch = sample.expiryMonth === (typeof paymentDetails.expiryMonth === 'string' ? parseInt(paymentDetails.expiryMonth) : paymentDetails.expiryMonth);
      const yearMatch = sample.expiryYear === (typeof paymentDetails.expiryYear === 'string' ? parseInt(paymentDetails.expiryYear) : paymentDetails.expiryYear);
      
      console.log(`Sample ${index + 1} (${sample.name}):`, {
        nameMatch,
        cardMatch,
        cvvMatch,
        monthMatch,
        yearMatch,
        allMatch: nameMatch && cardMatch && cvvMatch && monthMatch && yearMatch
      });
    });
    
    console.log('Final validation result:', this.paymentMockService.validatePayment(paymentDetails));
    console.log('=== END DEBUG ===');
  }

  placeOrder() {
    if (this.form.invalid) {
      this.showValidationErrorDialog = true;
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    // Create payment details for validation
    const paymentDetails: PaymentDetails = {
      name: this.form.get('cardName')?.value,
      cardNumber: this.form.get('cardNumber')?.value,
      cvv: this.form.get('cvv')?.value,
      expiryMonth: this.form.get('expiryMonth')?.value,
      expiryYear: this.form.get('expiryYear')?.value
    };

    // Debug payment validation
    this.debugPaymentValidation();

    // Check if payment details match sample data first
    if (this.paymentMockService.validatePayment(paymentDetails)) {
      // Payment details match - proceed with order
      const orderRequest: OrderRequest = {
        cardHolderName: paymentDetails.name,
        cardNumber: paymentDetails.cardNumber,
        cvv: paymentDetails.cvv,
        expiryDate: `${paymentDetails.expiryMonth.toString().padStart(2, '0')}/${paymentDetails.expiryYear.toString().slice(-2)}`,
        totalItems: this.totalItems,
        totalAmount: this.totalAmount
      };

      this.placeOrderService.placeOrder(orderRequest).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            // Use order ID from backend response
            this.orderId = response.orderId || 0;
            
            // Show success dialog with order ID from response
            this.dialogMessage = `Order placed successfully. Your Order ID is: ORD-${this.orderId}`;
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
    } else {
      // Payment details don't match sample data - show payment verification error dialog
      this.loading = false;
      this.dialogMessage = 'Payment details not verified.';
      this.showErrorDialog = true;
    }
  }

  confirmDialog() {
    this.showDialog = false;
    this.router.navigate(['/invoice', this.orderId]);
  }

  closeErrorDialog() {
    this.showErrorDialog = false;
  }

  closeValidationErrorDialog() {
    this.showValidationErrorDialog = false;
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
