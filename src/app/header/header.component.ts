import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router,RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone:true,
  imports:[CommonModule,FormsModule,RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  // Placeholder properties for future use
  phoneNumber: string = '01222 323 233';
  email: string = 'Yourremail@gmail.com';
  cartItemCount: number = 0; // Example for future use

  // Example of a method to handle search (this can be expanded)
  onSearch(searchTerm: string) {
    console.log('Search term:', searchTerm);
    // Implement search logic here
  }
}
