import { Component, OnInit }  from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface Product {
  id: number; name: string; description: string;
  quantity: number; imageUrl: string; price: number;
}

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {
  product!: Product;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.params['id'];
    const all: Product[] = JSON.parse(localStorage.getItem('products')||'[]');
    this.product = all.find(p => p.id===id)!;
  }

  save() {
    const all: Product[] = JSON.parse(localStorage.getItem('products')||'[]');
    const idx = all.findIndex(p => p.id===this.product.id);
    if (idx > -1) {
      all[idx] = this.product;
      localStorage.setItem('products', JSON.stringify(all));
      console.log('Updated:', this.product);
    }
    this.router.navigate(['admin/view-product']);
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

