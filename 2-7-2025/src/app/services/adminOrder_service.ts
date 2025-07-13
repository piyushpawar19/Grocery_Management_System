import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderItem } from '../shared/interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminOrderService {
  private baseUrl = 'http://localhost:9090/api/admin/orders';

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl);
  }
} 