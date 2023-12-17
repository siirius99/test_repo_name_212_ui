import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  // tableType='vendor'
  // displayedColumnsDetail: any[] = [
  //   {name:'Name',key:'name',type:'string'},
  //   {name:'Tag category',key:'tag_categories__name',type:'string'},
  //   {name:'Updated date',key:'updated_timestamp',type:'date'},
  //   {name:'Active',key:'active',type:'boolean'},
  // ]
  // taqlQuery:any={
  //   "fields":[{"name":"name"},{"name":"updated_timestamp"},{"name":"active"},{"name":"uuid"},{"name":"tag_categories_uuid"}],
  //   "sort":[{"name":"updated_timestamp","order":"desc"}],
  //   "joins":[
  //   {"table_name":"tag_categories","join_type":"left_join","left_table_attribute":"tag_categories_uuid","right_table_attribute":"uuid",
  //   "fields":[{"name":"name"}]}
  //   ]
  // }

  // displayedColumnsDetailVendor: any[] = [
  //   {name:'ID',key:'id',type:'number'},
  //   {name:'Business name',key:'business_name',type:'string'},
  //   {name:'Email',key:'email',type:'string'},
  //   {name:'Business ID',key:'business_id_number',type:'string'},
  //   {name:'Phone number',key:'phone_number',type:'string'},
  //   {name:'Updated date',key:'updated_timestamp',type:'date'},
  //   {name:'Active',key:'active',type:'boolean'},
  // ]
  // taqlQueryVendor:any={}

  // displayedColumnsDetailExpense: any[] = [
  //   {name:'ID',key:'id',type:'number'},
  //   {name:'Category',key:'type',type:'string'},
  //   {name:'Expense Type',key:'expense_types__name',type:'string'},
  //   {name:'Description',key:'description',type:'string'},
  //   {name:'Category code',key:'code',type:'string'},
  //   {name:'Updated date',key:'updated_timestamp',type:'date'},
  //   {name:'Active',key:'active',type:'boolean'},
  // ]
  // taqlQueryExpense:any={
  //   "joins":[{"table_name":"expense_types","join_type":"left_join","left_table_attribute":"expense_type_uuid","right_table_attribute":"uuid","fields":[{"name":"name"}]}]
  // }

}