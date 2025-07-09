import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule} from '@angular/router';
// import {InsertProductComponent} from './pages/insert-product-page/insert-product.component'
import {HttpClientModule} from '@angular/common/http'
import { CommonModule} from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BasicAuthInterceptor } from './interceptors/basic-auth.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { AddToCartComponent } from './pages/add-to-cart/add-to-cart.component';
import { BuyNowComponent } from './pages/buy-now/buy-now.component';
import { InvoiceComponent } from './pages/invoice/invoice.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { LoginComponent } from './pages/user-login/user-login.component';
import { LoginSelectionComponent } from './pages/login-selection/login-selection.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { InsertProductComponent } from './pages/insert-product-page/insert-product.component';
import { ViewProductComponent } from './pages/view-product/view-product.component';
import { UpdateProductComponent } from './pages/update-product/update-product.component';
import { ViewCustomerComponent } from './pages/view-customer/view-customer.component';
import { ProfileComponent } from './pages/profile-page/profile-page.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';


@NgModule({
  declarations: [
    AppComponent,
    // NavbarComponent,
    LoginComponent,
    FooterComponent,
    HomeComponent,
    InvoiceComponent,
    BuyNowComponent,
    AddToCartComponent,
    ProductPageComponent,
    UserDashboardComponent,
    RegisterComponent,
    AdminLoginComponent,
    LoginSelectionComponent,
    AdminDashboardComponent,
    InsertProductComponent,
    ViewProductComponent,
    UpdateProductComponent,
    ViewCustomerComponent,
    ProfileComponent,
    ChangePasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    HttpClientModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


