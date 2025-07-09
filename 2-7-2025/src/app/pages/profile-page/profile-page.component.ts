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
  showLogoutConfirm = false;
  submitted = false;
  loading = false;
  errorMsg = '';
  updateErrorMsg = '';
  touchedFields: { [key: string]: boolean } = {};

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      customerName: [
        { value: '', disabled: true }, 
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(/^[A-Za-z ]+$/)
        ]
      ],
      address: [{ value: '', disabled: true }, [Validators.required]],
      contactNumber: [
        { value: '', disabled: true },
        [Validators.required, Validators.pattern(/^\d{10}$/)]
      ],
      email: [
        { value: '', disabled: true },
        [Validators.required, customEmailValidator]
      ]
    });
    this.fetchProfile();
  }

  goBack(): void {
    this.router.navigate(['/user-dashboard']);
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

  getErrorMsg(field: string): string {
    const control = this.f[field];
    const errs = control.errors || {};

    if (errs['required']) {
      if (field === 'email') return 'Email is required.';
      if (field === 'contactNumber') return 'Mobile number is required.';
      return `${this.label(field)} is required.`;
    }
    if (field === 'customerName' && errs['maxlength']) {
      return `Name cannot exceed ${errs['maxlength'].requiredLength} characters.`;
    }
    if (field === 'customerName' && errs['pattern']) {
      return `Name can only contain letters and spaces.`;
    }
    if (field === 'email' && errs['customEmail']) {
      return 'Please enter a valid email address (e.g. john.doe@example.com).';
    }
    if (errs['email']) {
      return `Please enter a valid email address.`;
    }
    if (field === 'contactNumber') {
      if (errs['pattern']) {
        if (control.value && control.value.length > 10) {
          return 'Mobile number cannot exceed 10 digits.';
        }
        return 'Mobile number must be exactly 10 digits.';
      }
      if (control.value && control.value.length > 10) {
        return 'Mobile number cannot exceed 10 digits.';
      }
      if (control.value && control.value.length < 10) {
        return 'Mobile number must be exactly 10 digits.';
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
      this.updateErrorMsg = 'Customer ID not found. Please login again.';
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
        if (err.error?.message) {
          this.updateErrorMsg = err.error.message;
        } else {
          this.updateErrorMsg = 'Unable to update, please try again.';
        }
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

  closeDialog(): void {
    this.showUpdateDialog = false;
  }

  confirmLogout() {
    this.showLogoutConfirm = false;
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    this.router.navigateByUrl('/user-login');
  }

  cancelLogout() {
    this.showLogoutConfirm = false;
  }
}

