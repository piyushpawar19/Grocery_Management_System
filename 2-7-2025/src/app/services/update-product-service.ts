import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

// Backend Product interface to match the Java model
export interface BackendProduct {
  productId?: number;
  productName: string;
  productDescription: string;
  quantity: number;
  price: number;
  reserved?: string;
}

@Injectable({ providedIn: 'root' })
export class UpdateProductService {
  private baseUrl = 'http://localhost:9090/api/products';

  constructor(private http: HttpClient) {}

  getProduct(productId: number): Observable<ProductDto> {
    return this.http.get<BackendProduct>(`${this.baseUrl}/${productId}`).pipe(
      map(backendProduct => this.mapBackendToFrontend(backendProduct))
    );
  }

  updateProduct(productId: number, data: UpdateProductRequest): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const backendData = this.mapFrontendToBackend(data);
    return this.http.put<any>(`${this.baseUrl}/${productId}`, backendData, { headers });
  }

  // Map backend product to frontend format
  private mapBackendToFrontend(backendProduct: BackendProduct): ProductDto {
    return {
      id: backendProduct.productId,
      name: backendProduct.productName,
      description: backendProduct.productDescription,
      quantity: backendProduct.quantity,
      price: backendProduct.price,
      imageUrl: '' // Backend doesn't have imageUrl, so we'll use empty string
    };
  }

  // Map frontend product to backend format
  private mapFrontendToBackend(frontendProduct: UpdateProductRequest): BackendProduct {
    return {
      productName: frontendProduct.name,
      productDescription: frontendProduct.description,
      quantity: frontendProduct.quantity,
      price: frontendProduct.price,
      reserved: 'NO' // Default value
    };
  }
}