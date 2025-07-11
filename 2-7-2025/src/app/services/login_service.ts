import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = 'http://localhost:9090/api/users';

  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    // Assuming data contains { email, password } or { username, password }
    // Store credentials in localStorage after successful login
    return this.http.post('http://localhost:9090/api/users/login', data).pipe(
      tap((res: any) => {
        // Use email as username if that's your login field
        localStorage.setItem('username', data.email || data.username);
        localStorage.setItem('password', data.password);
        // Store customer ID from login response
        if (res && res.customerId) {
          localStorage.setItem('customerId', res.customerId.toString());
        }
      })
    );
  }
}
