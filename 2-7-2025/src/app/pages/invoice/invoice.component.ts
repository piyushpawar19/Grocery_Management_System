import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface OrderItem { title: string; price: number; quantity: number; }

@Component({  
  selector: 'app-invoice',  
  templateUrl: './invoice.component.html',  
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  orderId!: string;
  date = new Date();
  items: OrderItem[] = [];
  total = 0;
  address = '123 Main St, City, Country';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('orderId')!;
    // TODO: fetch real data
    this.items = [ {title:'Apple',price:1,quantity:2}, {title:'Banana',price:0.5,quantity:3} ];
    this.total = this.items.reduce((sum, i) => sum + i.price*i.quantity, 0);
  }

  goBack(): void {
    this.router.navigate(['/user-dashboard']);
  }

  back() { this.router.navigate(['/dashboard']); }

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
