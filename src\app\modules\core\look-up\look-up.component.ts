import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';

@Component({
  selector: 'app-look-up',
  templateUrl: './look-up.component.html',
  styleUrls: ['./look-up.component.scss']
})

export class LookUpComponent implements OnInit{
  showSettings=false
  settingTab=false
  loading=false
  constructor(public sharedService:SharedService){}
  ngOnInit(): void {
    this.sharedService.showSide = true
    this.sharedService.lookupTableType=this.sharedService.mainTableList?.[0]?.name || this.sharedService.lookupTableList?.[0]?.name
    this.showSettings=this.sharedService.lookupTableType == this.sharedService.lookupTableList?.[0]?.name
    
    this.loading=true
    setTimeout(() => {
      this.loading=false
    }, 500);
  }
}
