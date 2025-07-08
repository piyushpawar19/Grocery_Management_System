import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

interface User {
  id: number;
  name: string;
  email: string;
  address: string;
  phone: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  editMode = false;
  showUpdateDialog = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // stub user; replace with real data load
    const user: User = {
      id: 1234,
      name: 'John Doe',
      email: 'john.doe@example.com',
      address: '123 Maple Street',
      phone: '9876543210'
    };

    this.profileForm = this.fb.group({
      id: [{ value: user.id, disabled: true }],
      name: [
        user.name,
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(/^[A-Za-z ]+$/)
        ]
      ],
      email: [user.email, [Validators.required, Validators.email]],
      address: [user.address, Validators.required],
      phone: [
        user.phone,
        [Validators.required, Validators.pattern(/^[6-9][0-9]{9}$/)]
      ]
    });

    // disable fields initially
    Object.keys(this.profileForm.controls).forEach((key) => {
      if (key !== 'id') this.profileForm.controls[key].disable();
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.profileForm.controls;
  }

  isInvalid(field: string): boolean {
    const control = this.f[field];
    return control.invalid && (control.touched || control.dirty);
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
    if (field === 'phone' && errs['pattern']) {
      return `Phone must start with 6‑9 and be 10 digits.`;
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

  toggleEdit(): void {
    this.editMode = !this.editMode;
    if (this.editMode) {
      // enable all except id
      Object.keys(this.f).forEach((key) => {
        if (key !== 'id') this.f[key].enable();
      });
    } else {
      // cancel: reset form to original model and disable
      const raw = this.profileForm.getRawValue();
      this.profileForm.reset({
        id: raw.id,
        name: raw.name,
        email: raw.email,
        address: raw.address,
        phone: raw.phone
      });
      Object.keys(this.f).forEach((key) => this.f[key].disable());
    }
  }

  save(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    // here you would persist to a service...
    console.log('Saved user:', this.profileForm.getRawValue());
    // disable after save
    Object.keys(this.f).forEach((key) => {
      if (key !== 'id') this.f[key].disable();
    });
    this.editMode = false;
    this.showUpdateDialog = true;
  }

  closeDialog(): void {
    this.showUpdateDialog = false;
  }

  showLogoutConfirm = false;

// Then, add these two methods in the class:

confirmLogout() {
  this.showLogoutConfirm = false;
  // Navigate to login/root/home page
  window.location.href = '/';
}

cancelLogout() {
  this.showLogoutConfirm = false;
}

}

