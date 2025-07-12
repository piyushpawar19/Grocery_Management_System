import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Router } from '@angular/router';
import { ChangePasswordService } from '../../services/change_password_service';
import { HttpErrorResponse } from '@angular/common/http';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  pwdForm!: FormGroup;
  submitted = false;
  showDialog = false;
  showErrorDialog = false;
  errorDialogMessage = '';

  // Password validation pattern (same as registration)
  private passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private changePasswordService: ChangePasswordService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.pwdForm = this.fb.group(
      {
        oldPassword: ['', [Validators.required]],
        newPassword: [
          '', 
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(this.passwordPattern)
          ]
        ],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  goBack(): void {
    // Use role-based navigation - go to profile page of appropriate dashboard
    const profileRoute = this.roleService.getProfileRoute();
    this.router.navigate([profileRoute]);
  }

  // Cross‑field validator
  private passwordsMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const np = control.get('newPassword')?.value;
    const cp = control.get('confirmPassword')?.value;
    return np && cp && np !== cp ? { mismatch: true } : null;
  }

  // Shortcut to controls
  get f(): { [key: string]: AbstractControl } {
    return this.pwdForm.controls;
  }

  // Used in template to highlight invalid fields
  isInvalid(field: string): boolean {
    const ctr = this.f[field];
    return (
      (ctr.touched || this.submitted) && ctr.invalid
    );
  }

  // Inline error messages
  getErrorMsg(field: string): string {
    const ctr = this.f[field];
    const errs = ctr.errors || {};

    if (errs['required']) {
      return 'This field is required.';
    }
    if (errs['minlength'] && field === 'newPassword') {
      return `Password must be at least ${errs['minlength'].requiredLength} characters.`;
    }
    if (errs['pattern'] && field === 'newPassword') {
      return 'Password must include uppercase, lowercase, number & symbol.';
    }
    if (field === 'confirmPassword' && this.pwdForm.hasError('mismatch')) {
      return 'Passwords do not match.';
    }
    return '';
  }

  showMismatch(): boolean {
    return (
      (this.f['newPassword'].touched || this.submitted) &&
      this.pwdForm.hasError('mismatch') &&
      !this.f['newPassword'].hasError('required') &&
      !this.f['newPassword'].hasError('minlength') &&
      !this.f['newPassword'].hasError('pattern')
    );
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.pwdForm.invalid) {
      this.pwdForm.markAllAsTouched();
      return;
    }
    
    // Check if customerId is available
    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
      this.showErrorDialogWithMessage('Customer ID not found. Please login again.');
      return;
    }
    
    // Check if old password and new password are the same
    const oldPassword = this.f['oldPassword'].value;
    const newPassword = this.f['newPassword'].value;
    
    if (oldPassword === newPassword) {
      this.showErrorDialogWithMessage('New password must be different from the old password.');
      return;
    }
    
    const payload = {
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmPassword: this.f['confirmPassword'].value
    };
    
    this.changePasswordService.changePassword(payload).subscribe({
      next: (res) => {
        this.showDialog = true;
      },
      error: (err: HttpErrorResponse) => {
        let errorMessage = 'Password change failed. Please try again.';
        
        if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (err.status === 401) {
          errorMessage = 'Session expired. Please log in again.';
        } else if (err.status === 400) {
          errorMessage = 'Old password is incorrect or new password is invalid.';
        } else if (err.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        this.showErrorDialogWithMessage(errorMessage);
      }
    });
  }

  showErrorDialogWithMessage(message: string): void {
    this.errorDialogMessage = message;
    this.showErrorDialog = true;
  }

  closeDialog(): void {
    this.showDialog = false;
    // Clear localStorage and redirect to login selection page
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('customerId');
    this.router.navigate(['/login-selection']);
  }

  closeErrorDialog(): void {
    this.showErrorDialog = false;
    this.errorDialogMessage = '';
  }
}

