import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationService } from '../../services/registration_service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  regForm!: FormGroup;
  submitted = false;
  showDialog = false;

  // Password must be 8+ chars, uppercase, lowercase, digit, special
  private passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  constructor(private fb: FormBuilder, private router: Router, private registrationService: RegistrationService) {}

  ngOnInit(): void {
    this.regForm = this.fb.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.maxLength(30),
            Validators.pattern(/^[A-Za-z ]+$/)
          ]
        ],
        email: ['', [Validators.required, Validators.email]],
        phone: [
          '',
          [Validators.required, this.phoneValidator]
        ],
        address: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(this.passwordPattern)
          ]
        ],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Custom phone validator: must start with 6-9 and be 10 digits
  private phoneValidator(control: AbstractControl): ValidationErrors | null {
    const val: string = control.value || '';
    if (!/^[6-9]\d{9}$/.test(val)) {
      return { invalidPhone: true };
    }
    return null;
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pw = group.get('password')?.value;
    const cpw = group.get('confirmPassword')?.value;
    return pw && cpw && pw !== cpw ? { passwordsMismatch: true } : null;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.regForm.controls;
  }

  isInvalid(field: string): boolean {
    const control = this.f[field];
    return (
      (control.touched || this.submitted) &&
      (control.invalid ||
        (field === 'confirmPassword' && this.regForm.hasError('passwordsMismatch')))
    );
  }

  getErrorMsg(field: string): string {
    const control = this.f[field];
    const errs = control.errors || {};

    if (errs['required']) {
      return `${this.label(field)} is required.`;
    }
    if (field === 'name' && errs['maxlength']) {
      return `Name cannot exceed ${errs['maxlength'].requiredLength} characters.`;
    }
    if (field === 'name' && errs['pattern']) {
      return `Name can only contain letters and spaces.`;
    }
    if (errs['email']) {
      return `Please enter a valid email address.`;
    }
    if (field === 'phone' && errs['invalidPhone']) {
      return `Phone must start with 6, 7, 8, or 9 and be exactly 10 digits.`;
    }
    if (errs['minlength'] && field === 'password') {
      return `Password must be at least ${errs['minlength'].requiredLength} characters.`;
    }
    if (errs['pattern'] && field === 'password') {
      return `Password must include uppercase, lowercase, number & symbol.`;
    }
    if (field === 'confirmPassword' && this.regForm.errors?.['passwordsMismatch']) {
      return `Passwords do not match.`;
    }
    return '';
  }

  private label(field: string): string {
    switch (field) {
      case 'confirmPassword':
        return 'Confirm Password';
      case 'phone':
        return 'Phone Number';
      default:
        return field.charAt(0).toUpperCase() + field.slice(1);
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.regForm.invalid) {
      this.regForm.markAllAsTouched();
      return;
    }

    // Map form fields to backend fields
    const payload = {
      customerName: this.regForm.value.name,
      email: this.regForm.value.email,
      password: this.regForm.value.password,
      confirmPassword: this.regForm.value.confirmPassword,
      address: this.regForm.value.address,
      contactNumber: this.regForm.value.phone
    };

    this.registrationService.register(payload).subscribe({
      next: (res) => {
        this.showDialog = true;
      },
      error: (err) => {
        alert('Registration failed. Please try again.');
      }
    });
  }

  onDialogClose(): void {
    this.showDialog = false;
    this.regForm.reset();
    this.submitted = false;
    this.router.navigate(['/login-selection']);
  }
}