import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FakepaymentService } from '../services/fakepayment.service';
import { CommonModule } from '@angular/common';
import lottie, { AnimationItem } from 'lottie-web';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent, FooterComponent],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, AfterViewInit {
  @ViewChild('lottieContainer') lottieContainer!: ElementRef;

  paymentForm: FormGroup;
  paymentSuccessful = false;
  lottieAnimation: AnimationItem | null = null;

  constructor(
    private fb: FormBuilder, 
    private paymentService: FakepaymentService,
    private cdr: ChangeDetectorRef
  ) {
    this.paymentForm = this.fb.group({
      paymentMethod: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{16}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]]
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.initLottieAnimation();
  }

  initLottieAnimation() {
    if (this.lottieContainer && this.lottieContainer.nativeElement) {
      this.lottieAnimation = lottie.loadAnimation({
        container: this.lottieContainer.nativeElement,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: 'assets/success-animation.json'
      });
    }
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      this.paymentService.processPayment(this.paymentForm.value).subscribe(
        result => {
          if (result.success) {
            this.paymentSuccessful = true;
            this.cdr.detectChanges(); // Force change detection
            
            setTimeout(() => {
              this.initLottieAnimation();
              if (this.lottieAnimation) {
                this.lottieAnimation.play();
              }
              setTimeout(() => {
                alert('Payment successful! Transaction ID: ' + result.transactionId);
              }, 1500);
            }, 0);
          } else {
            alert('Payment failed: ' + result.message);
          }
        },
        error => {
          alert('An error occurred: ' + error.message);
        }
      );
    } else {
      alert('Please fill all fields correctly.');
    }
  }
}