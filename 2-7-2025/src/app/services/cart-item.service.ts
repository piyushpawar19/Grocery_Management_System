import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CartItemDeleteResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartItemService {
  private baseUrl = 'http://localhost:9090/api/cart';

  constructor(private http: HttpClient) { }

  deleteCartItem(productId: number): Observable<CartItemDeleteResponse> {
    const customerId = parseInt(localStorage.getItem('customerId') || '3');
    const params = new HttpParams().set('customerId', customerId.toString());
    
    return this.http.delete<CartItemDeleteResponse>(`${this.baseUrl}/${productId}`, { params });
  }
} 