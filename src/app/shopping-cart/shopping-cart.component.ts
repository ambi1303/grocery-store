// src/app/shopping-cart/shopping-cart.component.ts
import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Product } from '../models/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  standalone:true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cartItems: Product[] = [];

  constructor(private cartService: CartService,private router:Router) {}

  ngOnInit() {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  updateQuantity(productId: number, quantity: number) {
    this.cartService.updateQuantity(productId, quantity);
  }

  clearCart() {
    this.cartService.clearCart().then(()=>{
      console.log('Cart cleared');
    }).catch(error=>{
      console.error('Error clearing cart',error);
    });
  }
  updateCart() {
    this.cartService.saveCart().then(() => {
      console.log('Cart updated');
    }).catch(error => {
      console.error('Error updating cart', error);
    });
  }
  checkout() {
    this.cartService.checkout().subscribe(
      () => {
        console.log('Checkout successful');
        this.navigateToPayment();
        this.cartService.clearCart();
      },
      error => {
        console.error('Error during checkout', error);
      }
    );
  }


  getTotalPrice() {
    return this.cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  }
  navigateToPayment(){
    this.router.navigate(['/payment']);
  }
  
}