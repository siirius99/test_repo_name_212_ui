import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../shared/services/shared.service';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})

export class TablesComponent{
  tableName:string | null=null
  constructor(public sharedService:SharedService,public route:ActivatedRoute){
    route.params.subscribe((item:any)=>{
      this.tableName=item?.id
    })
  }
}
