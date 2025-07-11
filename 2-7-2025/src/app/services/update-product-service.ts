import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProductDto {
  id?: number;
  name: string;
  description: string;
  quantity: number;
  imageUrl: string;
  price: number;
}

export interface UpdateProductRequest {
  name: string;
  description: string;
  quantity: number;
  imageUrl: string;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class UpdateProductService {
  private baseUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  getProduct(productId: number): Observable<ProductDto> {
    return this.http.get<ProductDto>(`${this.baseUrl}/${productId}`);
  }

  updateProduct(productId: number, data: UpdateProductRequest): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.baseUrl}/${productId}`, data, { headers });
  }
}