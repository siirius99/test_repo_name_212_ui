import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ConfirmComponent } from '../../shared/modals/confirm/confirm.component';
import { SharedService } from '../../shared/services/shared.service';

@Component({
  selector: 'app-payment-cards',
  templateUrl: './payment-cards.component.html',
  styleUrls: ['./payment-cards.component.scss'],
})
export class PaymentCardsComponent {
  loading = false;
  cardsData: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private toast: ToastrService,
    private router: Router,
    private sharedService: SharedService,
    private ngxUiLoader: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.getCardsData();
  }

  getCardsData() {
    this.loading = true;
    this.cardsData = [];
    this.sharedService.getData('payment/methods').subscribe({
      next: (res) => {
        this.cardsData = res['data'];
        this.cardsData.sort((a, b) => {
          return a.is_default - b.is_default ? 0 : a.is_default ? -1 : 1;
        });
        this.cardsData.forEach((item) => {
          item.display_month = moment()
            .month((item.exp_month || 1) - 1)
            .format('MMM');
        });
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.toast.error(err);
      },
    });
  }

  editCard(element: any) {
    this.ngxUiLoader.startLoader('core-loader')
    this.sharedService.putData(`${element.id}/payment/method`, null).subscribe({
      next: (res) => {
        window.open(res?.url || '', '_self');
      },
      error: (err) => {
        this.toast.error(err);
      },
    });
  }

  addCard() {
    this.ngxUiLoader.startLoader('core-loader')
    this.sharedService.postData('payment/create_checkout_session', null).subscribe({
        next: (res) => {
          window.open(res?.url || '', '_self');
        },
        error: (err) => {
          this.toast.error(err);
        },
      });
  }

  defaultCard(element: any) {
    const confirmObj = {
      page: 'payment-card',
      title: 'Mark default',
      message: 'Mark this card as default card',
      action: 'Yes',
    };
    const value = this.sharedService.openDialog(
      ConfirmComponent,
      confirmObj,
      '50vw'
    );
    value.subscribe((dataValue) => {
      if (dataValue) {
        this.ngxUiLoader.startLoader('core-loader')
        this.sharedService.putData(`${element.id}/default/payment/method`, null).subscribe({
          next: (res) => {
            this.ngxUiLoader.startLoader('core-loader')
            this.toast.success(res.message)
            this.getCardsData();
          },
          error: (err) => {
            this.toast.error(err);
          },
        });
      }
    });
  }

  deleteCard(element: any) {
    const confirmObj = {
      page: 'payment-card',
      title: 'Delete card',
      message: 'Are you sure you want to delete this card?',
      action: 'Delete',
    };
    const value = this.sharedService.openDialog(
      ConfirmComponent,
      confirmObj,
      '50vw'
    );
    value.subscribe((dataValue) => {
      if (dataValue) {
        this.ngxUiLoader.startLoader('core-loader')
        this.sharedService.deleteData(`${element.id}/payment/method`).subscribe({
          next: (res) => {
            this.ngxUiLoader.startLoader('core-loader')
            this.toast.success(res.message)
            this.getCardsData();
          },
          error: (err) => {
            this.toast.error(err);
          },
        });
      }
    });
  }
}
