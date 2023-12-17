import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  layoutType='profile'
  displayedColumnsDetail: any[] = [
    {name:'Category',key:'type',type:'string'},
    {name:'Expense Type',key:'expense_types__name',type:'string'},
    {name:'Description',key:'description',type:'string'},
    {name:'Updated date',key:'updated_timestamp',type:'date'},
    {name:'Active',key:'active',type:'boolean'},
  ]
  taqlQuery:any={
    "joins":[{"table_name":"expense_types","join_type":"left_join","left_table_attribute":"expense_type_uuid","right_table_attribute":"uuid","fields":[{"name":"name"}]}]
  }
}
