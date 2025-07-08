import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface ProductDetail { id: number; title: string; image: string; price: number; description: string; }

@Component({  
  selector: 'app-product-page',  
  templateUrl: './product-page.component.html',  
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  product!: ProductDetail;
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    // TODO: load from service
    this.product = { id, title: 'Sample', image: 'assets/sample.jpg', price: 9.99, description: 'Lorem ipsum' };
  }

  addToCart() {
    // TODO: add service call
    this.router.navigate(['/cart']);
  }
  buyNow() {
    this.router.navigate(['/buy-now']);
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