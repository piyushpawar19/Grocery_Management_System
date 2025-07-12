import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { ProfileService, UserDto, UpdateProfileRequest } from '../../services/updateProfile_service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { RoleService } from '../../services/role.service';

// Custom email regex validator (same as registration)
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
function customEmailValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';
  if (!value) return null;
  return EMAIL_REGEX.test(value) ? null : { customEmail: true };
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  isEditMode = false;
  showUpdateDialog = false;
  showErrorDialog = false;
  showLogoutConfirm = false;
  submitted = false;
  loading = false;
  errorMsg = '';
  updateErrorMsg = '';
  errorDialogMessage = '';
  touchedFields: { [key: string]: boolean } = {};

  // Password validation pattern (same as registration)
  private passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private router: Router,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      customerName: [
        { value: '', disabled: true }, 
        [
          Validators.required,
          Validators.maxLength(30),
          this.alphabetsOnlyValidator
        ]
      ],
      address: [{ value: '', disabled: true }, [Validators.required]],
      contactNumber: [
        { value: '', disabled: true },
        [Validators.required, this.strictPhoneValidator]
      ],
      email: [
        { value: '', disabled: true },
        [Validators.required, this.strictEmailValidator]
      ]
    });
    this.fetchProfile();
  }

  // Strict name validator: only alphabets and spaces (same as registration)
  private alphabetsOnlyValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    if (!value) return null;
    const alphabetPattern = /^[A-Za-z\s]+$/;
    return alphabetPattern.test(value) ? null : { alphabetsOnly: true };
  }

  // Strict email validator (same as registration)
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

  // Strict phone validator: exactly 10 digits, numbers only, must start with 6-9 (same as registration)
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

  goBack(): void {
    // Use role-based navigation
    const dashboardRoute = this.roleService.getDashboardRoute();
    this.router.navigate([dashboardRoute]);
  }

  fetchProfile(): void {
    this.loading = true;
    this.errorMsg = '';
    
    // Check if customerId is available
    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
      this.errorMsg = 'Customer ID not found. Please login again.';
      this.loading = false;
      return;
    }
    
    this.profileService.getProfile().subscribe({
      next: (response: any) => {
        // Handle the new API response format
        this.profileForm.patchValue({
          id: response.id,
          customerName: response.customerName || '',
          address: response.address || '',
          contactNumber: response.contactNumber || '',
          email: response.email || ''
        });
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        if (err.error?.message) {
          this.errorMsg = err.error.message;
        } else {
          this.errorMsg = 'Failed to load profile, please retry.';
        }
        this.loading = false;
        this.isEditMode = false;
        this.profileForm.disable();
      }
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.profileForm.controls;
  }

  isInvalid(field: string): boolean {
    const control = this.f[field];
    return (control.touched || this.submitted) && control.invalid;
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
    const phoneControl = this.profileForm.get('contactNumber');
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
      if (field === 'contactNumber') return 'Mobile number is required.';
      return `${this.label(field)} is required.`;
    }
    
    if (field === 'customerName') {
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
    
    if (field === 'contactNumber') {
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
    return '';
  }

  private label(field: string): string {
    switch (field) {
      case 'contactNumber':
        return 'Mobile Number';
      case 'customerName':
        return 'Name';
      default:
        return field.charAt(0).toUpperCase() + field.slice(1);
    }
  }

  toggleEdit(): void {
    this.isEditMode = true;
    Object.keys(this.f).forEach((key) => this.f[key].enable());
    this.f['id'].disable();
    this.updateErrorMsg = '';
  }

  save(): void {
    this.submitted = true;
    this.updateErrorMsg = '';
    
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    
    // Check if customerId is available
    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
      this.showErrorDialogWithMessage('Customer ID not found. Please login again.');
      return;
    }
    
    this.loading = true;
    
    // Create payload for backend (only the fields that can be updated)
    const payload: UpdateProfileRequest = {
      customerName: this.profileForm.get('customerName')?.value,
      address: this.profileForm.get('address')?.value,
      contactNumber: this.profileForm.get('contactNumber')?.value,
      email: this.profileForm.get('email')?.value
    };
    
    this.profileService.updateProfile(payload).subscribe({
      next: (res: any) => {
        // Update the form with the response data
        if (res.user) {
          this.profileForm.patchValue({
            id: res.user.id,
            customerName: res.user.customerName,
            address: res.user.address,
            contactNumber: res.user.contactNumber,
            email: res.user.email
          });
        }
        this.showUpdateDialog = true;
        this.isEditMode = false;
        Object.keys(this.f).forEach((key) => this.f[key].disable());
        this.f['id'].disable(); // Keep ID disabled
        this.loading = false;
        this.submitted = false;
      },
      error: (err: HttpErrorResponse) => {
        let errorMessage = 'Unable to update profile. Please try again.';
        
        if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (err.status === 400) {
          errorMessage = 'Invalid data provided. Please check your input.';
        } else if (err.status === 401) {
          errorMessage = 'Session expired. Please login again.';
        } else if (err.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        this.showErrorDialogWithMessage(errorMessage);
        this.loading = false;
      }
    });
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.updateErrorMsg = '';
    this.fetchProfile();
    Object.keys(this.f).forEach((key) => this.f[key].disable());
  }

  showErrorDialogWithMessage(message: string): void {
    this.errorDialogMessage = message;
    this.showErrorDialog = true;
  }

  closeDialog(): void {
    this.showUpdateDialog = false;
  }

  closeErrorDialog(): void {
    this.showErrorDialog = false;
    this.errorDialogMessage = '';
  }

  confirmLogout() {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('customerId');
    this.router.navigate(['/login-selection']);
  }

  cancelLogout() {
    this.showLogoutConfirm = false;
  }
}

