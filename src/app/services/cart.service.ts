// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<Product[]>([]);
  private apiUrl='http://localhost:8000/api';

  constructor(
    private http:HttpClient,
    private authService:AuthService
  ){
    this.authService.loginEvent.subscribe(()=>{
      this.loadCart();
    })
  }
  private getHeaders(): HttpHeaders {
    const token = this.authService.getAccessToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  
  getCartItems() {
    return this.cartItems.asObservable();
  }

  addToCart(product: Product) {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      currentItems.push({ ...product, quantity: 1 });
    }

    this.cartItems.next([...currentItems]);
    this.saveCart();
  }

  removeFromCart(productId: number) {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.filter(item => item.id !== productId);
    this.cartItems.next(updatedItems);
    this.saveCart();
  }

  updateQuantity(productId: number, quantity: number) {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.map(item => 
      item.id === productId ? { ...item, quantity } : item
    );
    this.cartItems.next(updatedItems);
    this.saveCart();
  }

  clearCart() {
    this.cartItems.next([]);
    return this.http.delete(`${this.apiUrl}/cart`,{headers:this.getHeaders()}).toPromise();
  }

  saveCart(){
    const cartItems=this.cartItems.value.map(item=>({
      product_id:item.id,
      quantity:item.quantity|| 1
    }));
    return this.http.post(`${this.apiUrl}/cart`,{items:cartItems},{headers:this.getHeaders()}).toPromise();
  }
  
  checkout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout`, {},{headers:this.getHeaders()});
  }
  loadCart(){
    if(!this.authService.isLoggedIn()){
      console.log('User not logged in,cart not loaded');
      return;
    }
    const headers=this.getHeaders();
    this.http.get<{items:{product_id:number,quantity:number}[]}>(`${this.apiUrl}/cart`,{headers}).subscribe(
      (data)=>{
        console.log('Cart data received:',data);
        if(data && data.items){
          const productRequest=data.items.map(item=>
            this.http.get<Product>( `${this.apiUrl}/products/${item.product_id}`,{headers})
          );
          forkJoin(productRequest).subscribe(
            (products)=>{
              const cartItems=products.map((product,index)=>({
                ...product,
                quantity:data.items[index].quantity

              }));
              this.cartItems.next(cartItems);
              console.log('Cart loaded successfully',cartItems);
            },
            (error)=>console.error('Error fetching the product details ',error)
          );

        }else{
          console.error('Unexpected cart data format',data);
        }
      },
      (error)=>{
        console.error('Error laoding the cart',error);
        if(error.status===401){
          console.log('Unauthorized access,user might need to login in agian');
        }
      }
    );

  }
}