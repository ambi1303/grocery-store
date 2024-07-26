import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './user-profile.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PaymentComponent } from './payment/payment.component';
import { OrderComponent } from './order/order.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { AddressComponent } from './address/address.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SupportTicketComponent } from './support-ticket/support-ticket.component';

const routes: Routes = [
  { path: '', component: UserProfileComponent,
    children: [
      {path:'',redirectTo:'DashboardComponent',pathMatch:'full'},
      {path:'dashboard',component:DashboardComponent},
      { path: 'personalInfo', component: PersonalInfoComponent },
      {path:'payment',component:PaymentComponent},
      {path:'order',component:OrderComponent},
      {path:'wishlist',component:WishlistComponent},
      {path:'address',component:AddressComponent},
      {path:'reviews',component:ReviewsComponent},
      {path:'changepass',component:ChangePasswordComponent},
      {path:'support',component:SupportTicketComponent}
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    UserProfileComponent,
    PersonalInfoComponent,DashboardComponent
  ]
})
export class UserProfileModule { }
