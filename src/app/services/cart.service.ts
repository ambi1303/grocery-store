import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: Product[] = [];
  private cartItemCount = new BehaviorSubject(0);

  constructor() { }

  addToCart(product: Product) {
    this.items.push(product);
    this.cartItemCount.next(this.items.length);
  }

  getItems() {
    return this.items;
  }

  clearCart() {
    this.items = [];
    this.cartItemCount.next(0);
    return this.items;
  }

  removeFromCart(product: Product) {
    const index = this.items.findIndex(item => item.id === product.id);
    if (index > -1) {
      this.items.splice(index, 1);
      this.cartItemCount.next(this.items.length);
    }
  }

  getTotal() {
    return this.items.reduce((total, item) => total + item.price, 0);
  }

  getCartItemCount() {
    return this.cartItemCount.asObservable();
  }
}