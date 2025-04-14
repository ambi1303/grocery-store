import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Support {
  id: number;
  time: string;
  firstName: string;
  email: string;
  phoneNumber: string;
  description: string;
}

@Component({
  selector: 'app-support-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support-ticket.component.html',
  styleUrls: ['./support-ticket.component.css']
})
export class SupportTicketComponent {
  supports: Support[] = [];
  nextId: number = 361;
  newSupport: Partial<Support> = {};
  isFormPopupVisible: boolean = false;

  constructor() {
    this.initializeSupports();
  }

  initializeSupports(): void {
    // Initialize with some dummy data
    for (let i = 354; i <= 360; i++) {
      this.supports.push({
        id: i,
        time: '11th Oct, 2023',
        firstName: 'John',
        email: 'john.doe@example.com',
        phoneNumber: '123-456-7890',
        description: 'Standard dummy text ever since the 1500s.'
      });
    }
  }

  addSupport(): void {
    const newSupport: Support = {
      id: this.nextId++,
      time: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      firstName: this.newSupport.firstName,
      email: this.newSupport.email,
      phoneNumber: this.newSupport.phoneNumber,
      description: this.newSupport.description
    } as Support;

    this.supports.unshift(newSupport);
    this.isFormPopupVisible = false;
    this.newSupport = {};
  }

  deleteSupport(id: number): void {
    this.supports = this.supports.filter(support => support.id !== id);
  }

  toggleFormPopup(): void {
    this.isFormPopupVisible = !this.isFormPopupVisible;
  }
}
