import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderItem {
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  orderTime: string;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
}

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