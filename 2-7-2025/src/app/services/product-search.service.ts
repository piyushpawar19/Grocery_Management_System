import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Product {
  productId: number;
  productName: string;
  productDescription: string;
  price: number;
  quantity: number;
  reserved: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductSearchService {
  private baseUrl = 'http://localhost:9090/api/products';

  constructor(private http: HttpClient) {}

  searchProducts(query: string): Observable<Product[]> {
    if (!query || query.trim() === '') {
      return of([]);
    }

    const params = new HttpParams().set('q', query.trim());
    
    return this.http.get<Product[]>(`${this.baseUrl}/search`, { params })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Search API error:', error);
          
          // Return empty array instead of throwing error for better UX
          return of([]);
        })
      );
  }

  // Fallback method if search endpoint doesn't exist - search through all products
  searchProductsLocal(query: string, allProducts: Product[]): Product[] {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return allProducts;
    
    return allProducts.filter(product => 
      product.productName.toLowerCase().includes(searchTerm) ||
      product.productDescription.toLowerCase().includes(searchTerm)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred while searching products';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server error: ${error.status} - ${error.message}`;
    }
    
    console.error('Search service error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 