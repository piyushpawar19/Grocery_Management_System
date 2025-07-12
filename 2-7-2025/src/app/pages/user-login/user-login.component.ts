
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login_service';
import { Location } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showDialog: boolean = false;
  dialogTitle: string = 'Login Failed';
  dialogMessage: string = 'Login failed, check your credentials';

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private loginService: LoginService, 
    private location: Location,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value).subscribe({
        next: (res) => {
          // Store login data using AuthService
          this.authService.setLoginData(res);
          
          // Set customer-specific data
          localStorage.setItem('userRole', 'CUSTOMER');
          localStorage.setItem('isAdmin', 'false');
          
          console.log('User login successful:', res);
          this.router.navigate(['/user-dashboard']);
        },
        error: (err) => {
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
