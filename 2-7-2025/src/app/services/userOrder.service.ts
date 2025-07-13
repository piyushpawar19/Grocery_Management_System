import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderItem } from '../shared/interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class UserOrderService {
  private baseUrl = 'http://localhost:9090/api/user/orders';

  constructor(private http: HttpClient) {}

  getUserOrders(customerId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}?customerId=${customerId}`);
  }

  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${orderId}`);
  }
} 