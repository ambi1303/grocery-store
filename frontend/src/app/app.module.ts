import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
// import { CheckoutComponent } from './checkout/checkout.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { provideHttpClient,withFetch } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import player from 'lottie-web';
import { provideCacheableAnimationLoader, provideLottieOptions } from 'ngx-lottie';

export function playerFactory(){
    return player;
}
@NgModule({
    declarations: [],
    imports: [
        BrowserModule,FormsModule,ReactiveFormsModule,
        AppRoutingModule,BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        AppComponent,ProductListComponent,ProductDetailComponent,ShoppingCartComponent,
        LoginComponent,RegisterComponent,MatSnackBarModule
    ],
    providers:[provideHttpClient(withFetch()),
        provideLottieOptions({ player: () => player }),
    provideCacheableAnimationLoader()
    ],
    bootstrap: []
})
export class AppModule { }