export interface OrderItem {
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  orderTime: string;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
} 