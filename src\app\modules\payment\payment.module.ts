import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentComponent } from './payment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { LayoutModule } from '../layout/layout.module';
import { InvoicesComponent } from './invoices/invoices.component';
import { PaymentCardsComponent } from './payment-cards/payment-cards.component';
import { PaymentStatusComponent } from './payment-status/payment-status.component';


@NgModule({
  declarations: [
    PaymentComponent,
    InvoicesComponent,
    PaymentCardsComponent,
    PaymentStatusComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    PaymentRoutingModule
  ]
})
export class PaymentModule { }
