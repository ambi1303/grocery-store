import { CartItem } from './cart-item.model';

export interface Order {
  _id: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
}