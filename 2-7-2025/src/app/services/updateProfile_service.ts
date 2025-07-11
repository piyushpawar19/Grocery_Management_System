import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserDto {
  id?: number;
  customerName: string;
  email: string;
  address: string;
  contactNumber: string;
}

export interface UpdateProfileRequest {
  customerName: string;
  email: string;
  address: string;
  contactNumber: string;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private baseUrl = 'http://localhost:9090/api/users';
  constructor(private http: HttpClient) {}

  getProfile(): Observable<UserDto> {
    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
      throw new Error('Customer ID not found in localStorage');
    }
    return this.http.get<UserDto>(`${this.baseUrl}/me/${customerId}`);
  }

  updateProfile(data: UpdateProfileRequest): Observable<any> {
    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
      throw new Error('Customer ID not found in localStorage');
    }
    return this.http.put<any>(`${this.baseUrl}/me/${customerId}`, data);
  }
} 