// product-list.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ShoppingCartComponent } from './shopping-cart.component';
 const routes: Routes = [
  { path: '', component: ShoppingCartComponent }
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