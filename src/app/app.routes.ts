import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthGuard } from './auth.guard';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'register', 
    loadChildren: () => import('./register/register.module').then(m => m.RegisterModule),
    canActivate: [AuthGuard] 
  },
  { 
    path: 'products', 
    loadChildren: () => import('./product-list/product-list.module').then(m => m.ProductListModule),
    canActivate: [AuthGuard]
  },
  { path: 'products/:id', component: ProductDetailComponent },
  { 
    path: 'cart', 
    loadChildren: () => import('./shopping-cart/shopping-cart.module').then(m => m.ShoppingCartModule) 
  },
  { 
    path: 'profile', 
    loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfileModule) 
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];