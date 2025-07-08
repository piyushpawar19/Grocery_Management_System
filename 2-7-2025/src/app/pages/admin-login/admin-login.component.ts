import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdminLoginService } from '../../services/adminLogin_service';
@Component({ selector: 'app-admin-login', templateUrl: './admin-login.component.html', styleUrls: ['./admin-login.component.css'] })
export class AdminLoginComponent implements OnInit {
  loginForm!: FormGroup;
  constructor(private fb: FormBuilder, private router:Router, private location: Location, private http: HttpClient, private AdminLoginService: AdminLoginService) {}
  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  onLogin() {
    if (this.loginForm.valid) {
      this.AdminLoginService.login(this.loginForm.value).subscribe({
        next: (res) => {
          // Store customerId in localStorage for later use (e.g., change password)
          if (res && res.customerId) {
            localStorage.setItem('customerId', res.customerId.toString());
          }
          this.router.navigate(['/user-dashboard']);
        },
        error: (err) => {
          alert('Login failed. Please check your credentials.');
        }
      });
    }
  }

  goBack() {
    this.location.back();
  }
}
