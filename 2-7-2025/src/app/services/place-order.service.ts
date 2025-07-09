import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderRequest {
  cardHolderName: string;
  cardNumber: string;
  cvv: string;
  expiryDate: string;
  totalItems: number;
  totalAmount: number;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  orderId?: number;
  totalItems?: number;
  totalAmount?: number;
  cardHolderName?: string;
  cardNumber?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlaceOrderService {
  private baseUrl = 'http://localhost:9090/api/orders';

  constructor(private http: HttpClient) { }

  placeOrder(request: OrderRequest): Observable<OrderResponse> {
    const customerId = parseInt(localStorage.getItem('customerId') || '3');
    const params = new HttpParams().set('customerId', customerId.toString());
    
    return this.http.post<OrderResponse>(`${this.baseUrl}/place-order`, request, { params });
  }
} 