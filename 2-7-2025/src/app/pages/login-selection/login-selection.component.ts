import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login-selection',
  templateUrl: './login-selection.component.html',
  styleUrls: ['./login-selection.component.css']
})
export class LoginSelectionComponent {
  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
