import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl?: string;
}

export interface CartResponse {
  items: CartItem[];
  cartTotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class GetCartService {
  private baseUrl = 'http://localhost:9090/api/cart';

  constructor(private http: HttpClient) {}

  getCartItems(): Observable<CartResponse> {
    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
      throw new Error('Customer ID not found in localStorage');
    }

    return this.http.get<CartResponse>(`${this.baseUrl}?customerId=${customerId}`);
  }
} 