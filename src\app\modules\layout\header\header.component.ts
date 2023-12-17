import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { ConfirmComponent } from '../../shared/modals/confirm/confirm.component';
import { SharedService } from '../../shared/services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild(MatMenuTrigger) menu!: MatMenuTrigger;
  showFiller:boolean=false
  userInfo:any=null
  constructor(public sharedService: SharedService,private router: Router){
    if(!sharedService.loginUser){
      this.logout()
    }
  }

  logout(){
    this.sharedService.signOut()
  }

  redirectSwagger(){
    window.open(`${this.sharedService.apiUrl}/api-docs/`,'_blank')
  }

  downloadCollection(){
    this.sharedService.getFile(`download/postman_collection`).subscribe({
      next: (data)=>{
        const file = new Blob([data.body], { type: data.headers.get('content-type') });
        const fileName = `postman_collection.json`;
        FileSaver.saveAs(file, fileName);
      },
      error: (error)=>{
      }
    })
  }

  async ngOnInit(): Promise<void> {
    this.userInfo=this.sharedService.userData
    if(!this.userInfo.is_admin){
      this.sharedService.getTableSchema()
      if(!this.sharedService.paymentStatus){
        await this.sharedService.getPaymentStatus()
      }
      this.checkBanner()
    }
  }

  checkBanner(){
    if(this.sharedService.paymentStatus?.show_banner) {
      this.openBanner()
    }
    else if(this.sharedService.paymentStatus?.subscription_status && !(this.sharedService.paymentStatus?.subscription_status=='trialing' || this.sharedService.paymentStatus?.subscription_status=='active')){
      this.openSubscriptionBanner()
    }
  }

  showSidebar(){
    this.sharedService.showSide ?
    setTimeout(() => {
      this.sharedService.showSide = !this.sharedService.showSide
    }, 500) :
    this.sharedService.showSide = !this.sharedService.showSide
    ;
  }

  showSettings(){
    return this.router.url.includes('/settings')
  }
  
  openBanner(){
    let dialogData:any= {
      title:`Trial Expired`,
      message:`Your trial has expired.`,
      action: 'Activate',
      page:'confirm-banner'
    }
    if (this.sharedService.paymentStatus?.trial_expired) {
      dialogData.message = `Your trial has expired.`;
    } else if (this.sharedService.paymentStatus?.days_left) {
      dialogData.message = `Your trial will expire in ${this.sharedService.paymentStatus?.days_left} day(s). To continue using without any interruptions, please activate your membership.`; 
      if(this.sharedService.paymentStatus?.days_left>3){
        return;
      }
    }
    const val=this.sharedService.openDialog(ConfirmComponent,dialogData,'50vw')
    val.subscribe({
      next: (res)=>{
        if(res){
          this.router.navigateByUrl('/payment')
        }
      }
    })
  }

  openSubscriptionBanner(){
    let dialogData:any= {
      title:`Subscription Expired`,
      message:`Your previous subscription payment has either expired or is incomplete. Please proceed to finalize your subscription.`,
      action: 'Continue',
      page:'confirm-banner'
    }
    const val=this.sharedService.openDialog(ConfirmComponent,dialogData,'50vw')
    val.subscribe({
      next: (res)=>{
        if(res){
          this.router.navigateByUrl('/payment')
        }
      }
    })
  }

  openMenu(){
    this.menu.openMenu()
  }
}
