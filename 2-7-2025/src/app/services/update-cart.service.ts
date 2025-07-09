import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CartItemUpdateRequest {
  productId: number;
  quantity: number;
}

export interface CartUpdateResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class UpdateCartService {
  private baseUrl = 'http://localhost:9090/api/cart';

  constructor(private http: HttpClient) { }

  updateCartItem(customerId: number, request: CartItemUpdateRequest): Observable<CartUpdateResponse> {
    const params = new HttpParams().set('customerId', customerId.toString());
    return this.http.put<CartUpdateResponse>(this.baseUrl, request, { params });
  }
} 