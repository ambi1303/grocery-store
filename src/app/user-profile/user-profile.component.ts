import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from '../footer/footer.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { Router,RouterModule, RouterOutlet } from '@angular/router';
import { CommonEngine } from '@angular/ssr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink,RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,PersonalInfoComponent,RouterOutlet,CommonModule,FormsModule,RouterLink,RouterLinkActive],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
toggleDashboard() {
throw new Error('Method not implemented.');
}
  constructor(
    private router:Router
  ) { }
  navigateToPersonalinfo() {
    this.router.navigate(['profile/personalInfo'], { relativeTo: this.router.routerState.root });
  }
  menuItems = [
    { label: 'Dashboard', route: 'dashboard', icon: 'dashboard' },
    { label: 'Personal Information', route: 'personalInfo', icon: 'person' },
    {label:'Payment Method',route:'payment',icon:'credit_card'},
    {label:'Order',route:'order',icon:'shopping_cart'},
    {label:'WishList',route:'wishlist',icon:'favorite'},
    {label:'Address',route:'address',icon:'location_on'},
    {label:'Reviews',route:'reviews',icon:'star'},
    {label:'Change Password',route:'changepass',icon:'lock'},
    {label:'Support Ticket',route:'support',icon:'support'},
    {label:'Logout',route:'logout',icon:'exit_to_app'}
    // Add other menu items...
  ];
}
