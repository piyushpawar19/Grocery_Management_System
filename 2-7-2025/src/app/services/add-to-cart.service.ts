import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CartItemRequest {
  productId: number;
  quantity: number;
  customerId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AddToCartService {
  private baseUrl = 'http://localhost:9090/api/cart';

  constructor(private http: HttpClient) {}

  addToCart(productId: number, quantity: number = 1): Observable<any> {
    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
      throw new Error('Customer ID not found in localStorage');
    }

    const request: CartItemRequest = {
      productId: productId,
      quantity: quantity,
      customerId: parseInt(customerId)
    };

    console.log('Sending cart request:', request);
    return this.http.post(this.baseUrl, request);
  }
} 