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
import { AdminOrderHistoryComponent } from './pages/admin-order-history/admin-order-history.component';
import { UserOrderHistoryComponent } from './pages/user-order-history/user-order-history.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login-selection', component: LoginSelectionComponent },
  { path: 'user-login', component: LoginComponent},
  { path: 'admin-login', component: AdminLoginComponent },
  
  // Protected user routes
  { path: 'user-dashboard', component: UserDashboardComponent, canActivate: [AuthGuard] },  
  { path: 'user-dashboard/profile', component: ProfileComponent, canActivate: [AuthGuard] },  
  { path: 'user-dashboard/profile/change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },  
  { path: 'user-dashboard/order-history', component: UserOrderHistoryComponent, canActivate: [AuthGuard] },  
  { path: 'product/:id', component: ProductPageComponent },  
  { path: 'add-to-cart', component: AddToCartComponent, canActivate: [AuthGuard] },  
  { path: 'buy-now', component: BuyNowComponent, canActivate: [AuthGuard] },  
  { path: 'invoice/:orderId', component: InvoiceComponent, canActivate: [AuthGuard] },
  
  // Protected admin routes
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard], data: { requiresAdmin: true } },
  { path: 'admin/insert-product', component: InsertProductComponent, canActivate: [AuthGuard], data: { requiresAdmin: true } },
  { path: 'admin/update-product/:id', component: UpdateProductComponent, canActivate: [AuthGuard], data: { requiresAdmin: true } },
  { path: 'admin/view-product', component: ViewProductComponent, canActivate: [AuthGuard], data: { requiresAdmin: true } },
  { path: 'admin/view-customer', component: ViewCustomerComponent, canActivate: [AuthGuard], data: { requiresAdmin: true } },
  { path: 'admin-dashboard/order-history', component: AdminOrderHistoryComponent, canActivate: [AuthGuard], data: { requiresAdmin: true } },
  
  { path: '', component: HomeComponent },
  // future routes: user-login, change-password
  { path: '**', redirectTo: '' ,pathMatch:'full'}
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }