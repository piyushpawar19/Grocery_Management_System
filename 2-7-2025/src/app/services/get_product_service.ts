import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  productDescription: string;
  reserved: string;
  imageUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class GetProductService {
  private baseUrl = 'http://localhost:9090/api/products';
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    if (!username || !password) throw new Error('Not authenticated');
    return new HttpHeaders({
      'Authorization': 'Basic ' + btoa(`${username}:${password}`)
    });
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }
}
