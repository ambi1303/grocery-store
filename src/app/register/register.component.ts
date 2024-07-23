import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router,RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone:true,
  imports:[CommonModule,FormsModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  name: string = '';
  error:string='';

  constructor(private authService: AuthService,private router:Router) { }

  onSubmit() {
    this.authService.register(this.name, this.email, this.password).subscribe(
      response => {
        console.log('Registration successful',response);
        this.router.navigate(['/login'])
      },
      error => {
        console.error('Registration failed', error);
        // Handle registration error
      }
    );
  }
}