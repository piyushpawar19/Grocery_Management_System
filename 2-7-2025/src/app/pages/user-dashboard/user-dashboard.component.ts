import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetProductService } from '../../services/get_product_service';

interface Product {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  productDescription: string;
  reserved: string;
  // Add imageUrl if you have it in backend, otherwise use a placeholder
}

@Component({  
  selector: 'app-user-dashboard',  
  templateUrl: './user-dashboard.component.html',  
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  products: Product[] = [];
  constructor(private router: Router, private getProductService: GetProductService) {}

  ngOnInit() {
    this.getProductService.getAllProducts().subscribe({
      next: (data) => {
        console.log('Products from API:', data);
        this.products = data;
      },
      error: (err) => { this.products = []; }
    });
  }

  viewProduct(id: number) {
    this.router.navigate(['/product', id]);
  }
  
  // function increaseValue(): void {
  //   try {
  //     const numberInput = document.getElementById('number') as HTMLInputElement;
  //     let value: number = parseInt(numberInput.value, 10);
  //     if (isNaN(value)) {
  //       value = 0;
  //     }
  //     value++;
  //     numberInput.value = value.toString();
  //   } catch (error) {
  //     console.error("Error increasing value:", error);
  //     //Consider adding more user-friendly error handling here, e.g., displaying an alert.
  //   }
  // }

// }



// function decreaseValue(): void {
//   try {
//     const numberInput = document.getElementById('number') as HTMLInputElement;
//     let value: number = parseInt(numberInput.value, 10);
//     if (isNaN(value)) {
//       value = 0;
//     } else if (value < 1) {
//       value = 1;
//     } else {
//       value--;
//     }
//     numberInput.value = value.toString();
//   } catch (error) {
//     console.error("Error decreasing value:", error);
//     //Consider adding more user-friendly error handling here.
//   }
// }

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