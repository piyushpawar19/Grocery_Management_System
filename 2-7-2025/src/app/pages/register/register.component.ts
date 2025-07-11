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
import { Location } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  regForm!: FormGroup;
  submitted = false;
  showDialog = false;
  showEmailExistsDialog = false;
  showEmailErrorDialog = false;
  registeredEmail = '';
  emailErrorMessage = '';
  backendErrors: any = {};
  touchedFields: { [key: string]: boolean } = {};

  // Password must be 8+ chars, uppercase, lowercase, digit, special
  private passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  constructor(private fb: FormBuilder, private router: Router, private registrationService: RegistrationService, private location: Location) {}

  ngOnInit(): void {
    this.regForm = this.fb.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.maxLength(30),
            this.alphabetsOnlyValidator
          ]
        ],
        email: ['', [Validators.required, this.strictEmailValidator]],
        phone: [
          '',
          [Validators.required, this.strictPhoneValidator]
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

  // Strict name validator: only alphabets and spaces (no numbers or special characters)
  private alphabetsOnlyValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    if (!value) return null;
    const alphabetPattern = /^[A-Za-z\s]+$/;
    return alphabetPattern.test(value) ? null : { alphabetsOnly: true };
  }

  // Strict email validator
  private strictEmailValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    if (!value) return null;

    // Check if email starts with a number
    if (/^[0-9]/.test(value)) {
      return { emailStartsWithNumber: true };
    }

    // Check for exactly one @ symbol
    const atCount = (value.match(/@/g) || []).length;
    if (atCount !== 1) {
      return { invalidAtSymbol: true };
    }

    // Check for multiple consecutive dots or multiple domains
    if (value.includes('..') || /\..*\..*\./.test(value)) {
      return { multipleDots: true };
    }

    // Check for multiple domain extensions (e.g., .com.com, .com.in, .com.anything)
    const afterAtPart = value.split('@')[1];
    if (afterAtPart) {
      // Count dots in the domain part
      const dotCount = (afterAtPart.match(/\./g) || []).length;
      // If more than one dot, check if it's a valid subdomain structure
      if (dotCount > 1) {
        // Pattern to detect multiple top-level domains like .com.com, .in.org, etc.
        const multipleDomainsPattern = /\.(com|org|net|edu|gov|mil|int|co|in|uk|de|fr|jp|au|ca|us|info|biz|name|museum)\.(com|org|net|edu|gov|mil|int|co|in|uk|de|fr|jp|au|ca|us|info|biz|name|museum|[a-zA-Z]{2,})/i;
        if (multipleDomainsPattern.test(afterAtPart)) {
          return { multipleDomainExtensions: true };
        }
      }
    }

    // Basic email structure validation
    const emailPattern = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(value) ? null : { invalidEmailFormat: true };
  }

  // Strict phone validator: exactly 10 digits, numbers only, must start with 6-9
  private strictPhoneValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    if (!value) return null;
    
    // Check if contains only digits
    if (!/^\d+$/.test(value)) {
      return { numbersOnly: true };
    }
    
    // Check if exactly 10 digits
    if (value.length !== 10) {
      return { exactlyTenDigits: true };
    }
    
    // Check if starts with 6, 7, 8, or 9
    if (!/^[6-9]/.test(value)) {
      return { mustStartWith6789: true };
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

  // Track blur for each field
  onBlur(field: string) {
    this.touchedFields[field] = true;
  }

  // Only show error after blur or submit
  showError(field: string): boolean {
    return (this.touchedFields[field] || this.submitted) && this.isInvalid(field);
  }

  // Enforce phone to accept only numbers and max 10 digits
  enforcePhoneMaxLength() {
    const phoneControl = this.regForm.get('phone');
    if (phoneControl) {
      let val = phoneControl.value || '';
      // Remove any non-digit characters
      val = val.replace(/\D/g, '');
      // Limit to 10 digits
      if (val.length > 10) {
        val = val.slice(0, 10);
      }
      phoneControl.setValue(val, { emitEvent: false });
    }
  }

  getErrorMsg(field: string): string {
    const control = this.f[field];
    const errs = control.errors || {};

    if (errs['required']) {
      if (field === 'email') return 'Email is required.';
      if (field === 'phone') return 'Mobile number is required.';
      return `${this.label(field)} is required.`;
    }
    
    if (field === 'name') {
      if (errs['maxlength']) {
        return `Name cannot exceed ${errs['maxlength'].requiredLength} characters.`;
      }
      if (errs['alphabetsOnly']) {
        return 'Name can only contain alphabets and spaces (A-Z, a-z, space).';
      }
    }
    
    if (field === 'email') {
      if (errs['emailStartsWithNumber']) {
        return 'Email address cannot start with a number.';
      }
      if (errs['invalidAtSymbol']) {
        return 'Email must contain exactly one @ symbol.';
      }
      if (errs['multipleDots']) {
        return 'Email cannot contain consecutive dots or multiple domains.';
      }
      if (errs['multipleDomainExtensions']) {
        return 'Email cannot contain multiple domain extensions (e.g., .com.com, .com.in).';
      }
      if (errs['invalidEmailFormat']) {
        return 'Please enter a valid email address.';
      }
    }
    
    if (field === 'phone') {
      if (errs['numbersOnly']) {
        return 'Mobile number can only contain numbers.';
      }
      if (errs['exactlyTenDigits']) {
        return 'Mobile number must be exactly 10 digits.';
      }
      if (errs['mustStartWith6789']) {
        return 'Mobile number must start with 6, 7, 8, or 9.';
      }
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
    this.backendErrors = {};
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
        this.registeredEmail = this.regForm.value.email;
        this.showDialog = true;
      },
      error: (err) => {
        if (err.error && typeof err.error === 'object') {
          // Check if it's an email-related error and show dialog
          if (err.error.field === 'email' || err.error.message?.toLowerCase().includes('email')) {
            this.emailErrorMessage = err.error.message || 'Email validation failed.';
            this.showEmailErrorDialog = true;
          } else if (err.error.message?.toLowerCase().includes('already exists')) {
            this.emailErrorMessage = err.error.message;
            this.showEmailExistsDialog = true;
          } else {
            // Map backend errors to fields for non-email errors
            if (err.error.field && err.error.message) {
              this.backendErrors[err.error.field] = err.error.message;
            } else {
              // If multiple errors
              Object.keys(err.error).forEach(key => {
                this.backendErrors[key] = err.error[key];
              });
            }
          }
        } else if (err.error && typeof err.error === 'string') {
          // Handle string error messages
          if (err.error.toLowerCase().includes('email')) {
            this.emailErrorMessage = err.error;
            this.showEmailErrorDialog = true;
          } else if (err.error.toLowerCase().includes('already exists')) {
            this.emailErrorMessage = err.error;
            this.showEmailExistsDialog = true;
          } else {
            alert('Registration failed. Please try again.');
          }
        } else {
          alert('Registration failed. Please try again.');
        }
      }
    });
  }

  onDialogClose(): void {
    this.showDialog = false;
    this.regForm.reset();
    this.submitted = false;
    this.router.navigate(['/login-selection']);
  }

  onEmailExistsDialogClose(): void {
    this.showEmailExistsDialog = false;
    this.emailErrorMessage = '';
    // Keep the form data, just clear the email field for user to try again
    this.regForm.get('email')?.setValue('');
    this.regForm.get('email')?.markAsUntouched();
  }

  onEmailErrorDialogClose(): void {
    this.showEmailErrorDialog = false;
    this.emailErrorMessage = '';
    // Keep the form data, just clear the email field for user to try again
    this.regForm.get('email')?.setValue('');
    this.regForm.get('email')?.markAsUntouched();
  }

  // Prevent number input in name field
  onNameKeyPress(event: KeyboardEvent): boolean {
    const char = event.key;
    // Allow only alphabetic characters and spaces, prevent numbers and special characters
    if (!/^[A-Za-z\s]$/.test(char)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  goBack() {
    this.location.back();
  }
}