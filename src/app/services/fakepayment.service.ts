import { Injectable } from '@angular/core';
import {  Observable, of } from 'rxjs';
import { delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FakepaymentService {

  processPayment(amount: number): Observable<any> {
    return of({ success: true, amount }).pipe(delay(1000));
  }}
