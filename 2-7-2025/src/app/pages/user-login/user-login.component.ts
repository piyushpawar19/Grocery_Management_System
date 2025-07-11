
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login_service';
import { Location } from '@angular/common';

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

  constructor(private fb: FormBuilder, private router: Router, private loginService: LoginService, private location: Location) {}

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
          // Store customerId in localStorage for later use (e.g., change password)
          if (res && res.customerId) {
            localStorage.setItem('customerId', res.customerId.toString());
          }
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
