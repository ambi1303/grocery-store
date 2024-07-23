import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl=`${environment.apiUrl}/orders`;
  constructor(private http:HttpClient) { }

  createOrder(order:Partial<Order>):Observable<Order>{
    return this.http.post<Order>(this.apiUrl,order);

  }
  getOrders():Observable<Order[]>{
    return this.http.get<Order[]>(this.apiUrl);
  }
}
