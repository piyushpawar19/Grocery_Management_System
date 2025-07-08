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

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  pwdForm!: FormGroup;
  submitted = false;
  showDialog = false;

  // Must be 8+ chars, uppercase, lowercase, number, symbol
  private pwdPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  constructor(private fb: FormBuilder, private router: Router, private changePasswordService: ChangePasswordService) {}

  ngOnInit(): void {
    this.pwdForm = this.fb.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: [
          '',
          [Validators.required, Validators.pattern(this.pwdPattern)]
        ],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordsMatchValidator }
    );
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
      (ctr.touched || this.submitted) &&
      (ctr.invalid || (field === 'confirmPassword' && this.pwdForm.hasError('mismatch')))
    );
  }

  // Inline error messages
  getErrorMsg(field: string): string {
    const ctr = this.f[field];
    const errs = ctr.errors || {};

    if (errs['required']) {
      return 'This field is required.';
    }
    if (field === 'newPassword' && errs['pattern']) {
      return 'Password must be 8+ chars with uppercase, lowercase, number & symbol.';
    }
    if (field === 'confirmPassword' && this.pwdForm.hasError('mismatch')) {
      return 'Passwords do not match.';
    }
    return '';
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.pwdForm.invalid) {
      this.pwdForm.markAllAsTouched();
      return;
    }
    // Example: get customerId from localStorage (adjust as needed)
    const customerId = Number(localStorage.getItem('customerId'));
    const payload = {
      oldPassword: this.f['oldPassword'].value,
      newPassword: this.f['newPassword'].value,
      confirmPassword: this.f['confirmPassword'].value
    };
    this.changePasswordService.changePassword(customerId, payload).subscribe({
      next: (res) => {
        this.showDialog = true;
      },
      error: (err) => {
        alert('Password change failed. Please try again.');
      }
    });
  }

  closeDialog(): void {
    this.showDialog = false;
    // Optionally redirect:
    // this.router.navigate(['/']);
  }
}

