// add-card-dialog.component.ts
import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDateFormats } from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
@Component({
  selector: 'app-add-card-dialog',
  standalone: true,
  imports: [CommonModule,FormsModule,MatButtonModule,MatInputModule,MatFormFieldModule,MatDialogModule,MatDatepickerModule,MatNativeDateModule],
  templateUrl: './add-card-dialog.component.html',
  styleUrl: './add-card-dialog.component.css'
})
export class AddCardDialogComponent {


  card = { name: '', number: '', expiryDate: '', cvv: '', img: '' };

  constructor(public dialogRef: MatDialogRef<AddCardDialogComponent>) {}

  onSubmit(): void {
    this.dialogRef.close(this.card);
  }
}

