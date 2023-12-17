import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.scss']
})
export class PaymentStatusComponent {
  paymentSuccess : any
  constructor(private router:Router){
    this.paymentSuccess = router.url.includes('/payment_success')
  } 
}
