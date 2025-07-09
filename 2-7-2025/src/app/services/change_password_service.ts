import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  changePassword(data: any): Observable<any> {
    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
      throw new Error('Customer ID not found in localStorage');
    }
    return this.http.put(`${this.baseUrl}/${customerId}/password`, data);
  }
}
