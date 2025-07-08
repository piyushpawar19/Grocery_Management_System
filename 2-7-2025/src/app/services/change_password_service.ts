import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  changePassword(customerId: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${customerId}/password`, data);
  }
}
