import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent {
  addresses = [
    { name: 'Abdullah Al Mamun', email: 'demoemail@gmail.com', phone: '023 434 54354', city: 'Haydarabad, Rord 34', zip: '3454' },
    { name: 'Sajjad', email: 'demoemail@gmail.com', phone: '023 434 54354', city: 'Haydarabad, Rord 34', zip: '3454' }
  ];

  newAddress = { firstName: '', lastName: '', email: '', phone: '', address: '', city: '', zip: '' };
  showModal = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  addAddress() {
    const fullName = `${this.newAddress.firstName} ${this.newAddress.lastName}`;
    this.addresses.push({
      name: fullName,
      email: this.newAddress.email,
      phone: this.newAddress.phone,
      city: this.newAddress.city,
      zip: this.newAddress.zip
    });
    this.closeModal();
    this.newAddress = { firstName: '', lastName: '', email: '', phone: '', address: '', city: '', zip: '' };
  }
}