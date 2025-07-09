import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { GetCartService, CartItem, CartResponse } from '../../services/get-cart.service';
import { UpdateCartService, CartItemUpdateRequest } from '../../services/update-cart.service';
import { CartItemService } from '../../services/cart-item.service';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.css'],
})
export class AddToCartComponent implements OnInit {
  items: CartItem[] = [];
  cartTotal: number = 0;
  loading: boolean = false;
  errorMsg: string = '';
  showLogoutConfirm: boolean = false;
  
  constructor(
    private router: Router, 
    private location: Location,
    private getCartService: GetCartService,
    private updateCartService: UpdateCartService,
    private cartItemService: CartItemService
  ) {}

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.loadCartItems();
  }

  loadCartItems() {
    this.loading = true;
    this.errorMsg = '';
    
    this.getCartService.getCartItems().subscribe({
      next: (response: CartResponse) => {
        this.items = response.items;
        this.cartTotal = response.cartTotal;
        this.loading = false;
        console.log('Cart items loaded:', response);
      },
      error: (error) => {
        console.error('Error loading cart items:', error);
        this.errorMsg = 'Failed to load cart items. Please try again.';
        this.loading = false;
        // Fallback to empty cart
        this.items = [];
        this.cartTotal = 0;
      }
    });
  }

  increment(item: CartItem) {
    item.quantity++;
    item.totalPrice = item.unitPrice * item.quantity;
    this.updateCartTotal();
    this.updateCartItem(item);
  }

  decrement(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity--;
      item.totalPrice = item.unitPrice * item.quantity;
      this.updateCartTotal();
      this.updateCartItem(item);
    } else {
      this.remove(item);
    }
  }

  private updateCartTotal() {
    this.cartTotal = this.items.reduce((sum, i) => sum + i.totalPrice, 0);
  }

  private updateCartItem(item: CartItem) {
    const customerId = parseInt(localStorage.getItem('customerId') || '3');
    const request: CartItemUpdateRequest = {
      productId: item.productId,
      quantity: item.quantity
    };

    this.updateCartService.updateCartItem(customerId, request).subscribe({
      next: (response) => {
        console.log('Cart item updated successfully:', response);
      },
      error: (error) => {
        console.error('Error updating cart item:', error);
        // Revert the local changes on error
        this.loadCartItems();
      }
    });
  }

  remove(item: CartItem) {
    // Remove from local array first for immediate UI feedback
    this.items = this.items.filter((i) => i.productId !== item.productId);
    this.cartTotal = this.items.reduce((sum, i) => sum + i.totalPrice, 0);
    
    // Call DELETE API
    this.cartItemService.deleteCartItem(item.productId).subscribe({
      next: (response) => {
        console.log('Cart item removed successfully:', response);
      },
      error: (error) => {
        console.error('Error removing cart item:', error);
        // Reload cart to revert changes if API fails
        this.loadCartItems();
      }
    });
  }

  get totalItems() {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  get totalAmount() {
    return this.cartTotal;
  }

  buyNow() {
    // Save cart data to localStorage for the buy-now page
    const cartData = {
      totalItems: this.totalItems,
      totalAmount: this.totalAmount
    };
    localStorage.setItem('cartData', JSON.stringify(cartData));
    
    this.router.navigate(['/buy-now']);
  }

  back() {
    this.router.navigate(['dashboard']);
  }

  confirmLogout() {
    this.showLogoutConfirm = false;
    // Navigate to login/root/home page
    window.location.href = '/';
  }

  cancelLogout() {
    this.showLogoutConfirm = false;
  }
}
