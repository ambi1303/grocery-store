// payment.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface PaymentResult {
  success: boolean;
  message: string;
  transactionId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FakepaymentService {
  processPayment(paymentDetails: any): Observable<PaymentResult> {
    // Simulate API call
    return of({
      success: Math.random() > 0.2, // 80% success rate
      message: Math.random() > 0.2 ? 'Payment processed successfully' : 'Payment failed',
      transactionId: 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase()
    }).pipe(delay(2000)); // Simulate 2 second delay
  }
}