import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { error } from 'console';
import { trigger,state,style,transition,animate,keyframes } from '@angular/animations';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-login',
  standalone:true,
  imports:[CommonModule,FormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
         trigger('fadeIn', [
           state('void', style({ opacity: 0 })),
           transition(':enter', [
             animate('500ms ease-in', style({ opacity: 1 }))
           ])
         ]),
         trigger('shake', [
           transition(':enter', [
             animate('500ms ease-in', style({ opacity: 1 }))
           ]),
           transition('* => error', [
             animate('300ms', keyframes([
               style({ transform: 'translateX(0)', offset: 0 }),
               style({ transform: 'translateX(-10px)', offset: 0.2 }),
               style({ transform: 'translateX(10px)', offset: 0.4 }),
               style({ transform: 'translateX(-10px)', offset: 0.6 }),
               style({ transform: 'translateX(10px)', offset: 0.8 }),
               style({ transform: 'translateX(0)', offset: 1.0 })
             ]))
           ])
         ])
       ]
})

export class LoginComponent  {

  email: string = '';
  password: string = '';
  loginState:string='';
  passwordVisible: boolean = false;


  constructor(private authService: AuthService,private router:Router,
    private cartService:CartService
  ) { }

 onSubmit(){
  this.authService.login(this.email,this.password).subscribe(
    ()=>{
      this.cartService.loadCart();
      this.router.navigate(['/products']);
    
    },
    (error)=>{
      console.error('Invalid email or password',error);
      this.loginState = 'error'; // Trigger shake animation on error
          setTimeout(() => this.loginState = '', 300); // Reset state after animation
    }
  );
 }
 togglePasswordVisibility() {
  this.passwordVisible = !this.passwordVisible;
  const passwordField: any = document.getElementById('password');
  if (this.passwordVisible) {
    passwordField.type = 'text';
  } else {
    passwordField.type = 'password';
  }
}

}
