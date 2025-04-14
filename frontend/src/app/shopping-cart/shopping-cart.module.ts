// product-list.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ShoppingCartComponent } from './shopping-cart.component';
import { PaymentComponent } from '../payment/payment.component';
 const routes: Routes = [
  { path: '', component: ShoppingCartComponent },
  {path:'payment',component:PaymentComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    InfiniteScrollModule,
    ShoppingCartComponent
  ]
})
export class ShoppingCartModule { }