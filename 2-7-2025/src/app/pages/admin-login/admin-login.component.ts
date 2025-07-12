import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AdminLoginService } from '../../services/adminLogin_service';
import { AuthService } from '../../services/auth.service';
@Component({ selector: 'app-admin-login', templateUrl: './admin-login.component.html', styleUrls: ['./admin-login.component.css'] })
export class AdminLoginComponent implements OnInit {
  loginForm!: FormGroup;
  showDialog: boolean = false;
  dialogTitle: string = 'Login Failed';
  dialogMessage: string = 'Login failed, check your credentials';
  
  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private location: Location, 
    private http: HttpClient, 
    private AdminLoginService: AdminLoginService,
    private authService: AuthService
  ) {}
  ngOnInit() {
    // Clear any stored authentication credentials to prevent Basic auth conflicts
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  onLogin() {
    if (this.loginForm.valid) {
      this.AdminLoginService.login(this.loginForm.value).subscribe({
        next: (res) => {
          // Store login data using AuthService
          this.authService.setLoginData(res);
          
          // Set admin-specific data
          localStorage.setItem('userRole', 'ADMIN');
          localStorage.setItem('isAdmin', 'true');
          
          console.log('Admin login successful:', res);
          this.router.navigate(['/admin-dashboard']);
        },
        error: (err: HttpErrorResponse) => {
          let errorMessage = 'Login failed, check your credentials';
          
          if (err.error?.message) {
            errorMessage = err.error.message;
          } else if (err.status === 401) {
            errorMessage = 'Access denied. Admin privileges required.';
          } else if (err.status === 400) {
            errorMessage = 'Invalid email or password.';
          } else if (err.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          }
          
          this.dialogTitle = 'Login Failed';
          this.dialogMessage = errorMessage;
          this.showDialog = true;
        }
      });
    }
  }

  onDialogClose() {
    this.showDialog = false;
    this.loginForm.reset();
  }

  goBack() {
    this.location.back();
  }
}
