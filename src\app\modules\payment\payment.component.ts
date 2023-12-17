import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ConfirmComponent } from '../shared/modals/confirm/confirm.component';
import { SharedService } from '../shared/services/shared.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit{
  paymentStatus:any
  selectedPlan=''
  submitted=false
  constructor(public sharedService: SharedService,private toast: ToastrService,private ngxUiLoader: NgxUiLoaderService){}

  ngOnInit(): void {
  }

  checkPlan(){
    if(this.sharedService.paymentStatus?.trial_days_left && this.sharedService.paymentStatus?.trial_days_left > 0){
      const confirmObj = {
        page: 'confirm-banner',
        title: 'Buy Plan',
        message: `Your account currently has ${this.sharedService.paymentStatus?.trial_days_left} remaining trial days. Upon selecting a plan, the corresponding amount will be debited once the trial period concludes.`,
        action: 'Buy plan',
      };
      const value = this.sharedService.openDialog(ConfirmComponent,confirmObj,'50vw');
      value.subscribe((dataValue) => {
        if (dataValue) {
          this.checkout()
        }
      });
    }
    else{
      this.checkout()
    }
  }

  checkout(){
    this.submitted=true
    const payload={plan:this.selectedPlan}
    this.ngxUiLoader.startLoader('core-loader')
    this.sharedService.postData('create_checkout_session',payload).subscribe({
      next :(res)=>{
        window.open(res.url,'_self')
      },
      error :(error)=>{
        this.submitted=false
        this.toast.error(error)
      }
    })
  }
}
