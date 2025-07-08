import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { LoginSelectionComponent } from './pages/login-selection/login-selection.component';
import { LoginComponent } from './pages/user-login/user-login.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { AddToCartComponent } from './pages/add-to-cart/add-to-cart.component';
import { BuyNowComponent } from './pages/buy-now/buy-now.component';
import { InvoiceComponent } from './pages/invoice/invoice.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { InsertProductComponent } from './pages/insert-product-page/insert-product.component';
import { ViewProductComponent } from './pages/view-product/view-product.component';
import { UpdateProductComponent } from './pages/update-product/update-product.component';
import { ViewCustomerComponent } from './pages/view-customer/view-customer.component';
import { ProfileComponent } from './pages/profile-page/profile-page.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login-selection', component: LoginSelectionComponent },
  { path: 'user-login', component:  LoginComponent},
  { path: 'admin-login', component: AdminLoginComponent },
  
  { path: 'user-dashboard', component: UserDashboardComponent },  
  { path: 'user-dashboard/profile', component: ProfileComponent },  
  { path: 'user-dashboard/profile/change-password', component: ChangePasswordComponent },  
  { path: 'product/:id', component: ProductPageComponent },  
  { path: 'add-to-cart', component: AddToCartComponent },  
  { path: 'buy-now', component: BuyNowComponent },  
  { path: 'invoice/:orderId', component: InvoiceComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'admin/insert-product', component: InsertProductComponent },
  { path: 'admin/update-product/:id', component: UpdateProductComponent },
  { path: 'admin/view-product', component: ViewProductComponent },
  { path: 'admin/view-customer', component: ViewCustomerComponent },
  { path: '', component: HomeComponent },
  // future routes: user-login, change-password
  { path: '**', redirectTo: '' ,pathMatch:'full'}
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }