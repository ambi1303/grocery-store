import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone:true,
  imports: [CommonModule,FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
placeOrder() {
throw new Error('Method not implemented.');
}
  cartItems: any[] = [];
  total: number = 0;

  constructor(
    private cartService: CartService,
    private orderService: OrderService
  ) {
    // this.cartItems = this.cartService.getItems();
    // this.total = this.cartService.getTotal();
  }


}