import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddCardDialogComponent } from '../add-card-dialog/add-card-dialog.component';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  cards = [
    { name: 'Dutch Bangl Bank Lmtd', number: '5535', img: 'assets/bank1.png', expiryDate: '', cvv: '' },
    { name: 'Master Card', number: '5535', img: 'assets/mastercard.png', expiryDate: '', cvv: '' },
    { name: 'Paypal Account', number: '5535', img: 'assets/paypal.png', expiryDate: '', cvv: '' },
    { name: 'Visa Card', number: '5535', img: 'assets/visa.png', expiryDate: '', cvv: '' }
  ];
addCard: any;

  constructor(private dialog: MatDialog) {}

  openAddCardDialog(): void {
    const dialogRef = this.dialog.open(AddCardDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cards.push(result);
      }
    });
  }
}