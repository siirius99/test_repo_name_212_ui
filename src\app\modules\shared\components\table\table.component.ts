import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { CrudFormComponent } from '../../modals/crud-form/crud-form.component';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit{
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() page:any=''
  @Input() pageName:any=''
  @Input() tableFormat:any={}
  @Input() actions:any[]=[]
  displayedColumnsDetail: any[] = [];
  displayedColumns: string[] = [];
  sortItem:any={active:'',direction:''}
  dataList:any[]=[]
  optionsArray=[{name:'All',value:'all'},{name:'Yes',value:true},{name:'No',value:false}]
  dataSource!: MatTableDataSource<any>;
  customFilterValue:any={}
  booleanFilterArray:any[]=[]
  dateFilterArray:any[]=[]
  stringFilterArray:any[]=[]
  referenceFilterArray:any[]=[]
  numberFilterArray:any[]=[]
  getTableSubscription: Subscription | any = null;
  apiFilterParamsArray:any[]=[]
  totalEntries=0
  pageSize=10
  pageNumber=0
  showAddForm=false
  currentTableForm:any={}
  referenceTables:any={}
  showFilter=false
  primaryKey=''
  disableArchive=true
  constructor(private sharedService: SharedService,private toast:ToastrService,private ngxUiLoader: NgxUiLoaderService){}

  ngOnInit(): void {
    this.currentTableForm = this.tableFormat
    this.showAddForm=this.currentTableForm?.crud_post_enabled
    if(this.currentTableForm?.crud_put_enabled){
      this.actions.push('edit')
    }
    if(this.currentTableForm?.crud_delete_enabled){
      this.actions.push('delete')
    }
    if(this.currentTableForm?.crud_soft_delete_enabled){
      this.actions.push('archive')
    }
    this.ngxUiLoader.startLoader('core-loader')
    this.getTableData()
    this.generateTable()
  }

  generateTable(){
    for(let key of Object.keys(this.currentTableForm.external_fields)){
      if(this.actions.includes('archive')){
        if(this.currentTableForm.external_fields[key]?.soft_delete?.configured){
          this.disableArchive=false
        }
      }
      if(!(this.currentTableForm.external_fields[key]?.session || this.currentTableForm.external_fields[key]?.primary)){
        let formItem={key:key,name:this.currentTableForm.external_fields[key]?.display_name || this.currentTableForm.external_fields[key]?.name,type:this.currentTableForm.external_fields[key]?.data_type,reference:this.currentTableForm.external_fields[key]?.reference}
        // if(!formItem?.name){
        //   let name:string=formItem.key
        //   formItem.name = name.replaceAll('_',' ')
        //   formItem.name = formItem.name.charAt(0).toUpperCase() + formItem.name.slice(1)
        // }
        // formItem.name = formItem.name.replace(/(?<=[a-z])(?=[A-Z])/g, ' ').trim()
        if (formItem?.reference?.table) {
          formItem.reference.display= formItem.reference.display || 'name'
          this.sharedService.getCrudData(formItem.reference.table).subscribe({
            next: (data)=>{
              this.referenceTables[formItem.reference.table]=data.data
            },
            error: (err)=>{
              this.toast.error(err)
            }
          })
        }
        else{
          delete formItem.reference
        }
        this.displayedColumnsDetail.push(formItem)
      }
      if(this.currentTableForm.external_fields[key]?.primary){
        this.primaryKey=key
      }
    }
    this.setFilter()
  }

  setFilter(){
    this.displayedColumns=[]
    for(let item of this.displayedColumnsDetail){
      this.displayedColumns.push(item.key)
      if(item.reference){
        this.referenceFilterArray.push({name:item.name,key:item.key,reference:item.reference})
        this.customFilterValue[item.key]=''
      }
      else if(item.type=='boolean'){
        this.booleanFilterArray.push({name:item.name,key:item.key})
        this.customFilterValue[item.key]='all'
      }
      else if(item.type=='date' || item.type=='datetime'){
        this.dateFilterArray.push({name:item.name,key:item.key})
        this.customFilterValue[item.key]={start:null,end:null}
      }
      else if(item.type=='number' || item.type=='int' || item.type=='double'){
        this.numberFilterArray.push({name:item.name,key:item.key})
        this.customFilterValue[item.key]={min:0,max:0}
      }
      else{
        this.stringFilterArray.push({name:item.name,key:item.key})
        this.customFilterValue[item.key]=''
      }
    }
    if(this.actions.length){
      this.displayedColumns.push('action')
    }
  }
  applyFilter(){
    let filtersArray:any[]=[]

    for(let filter of this.booleanFilterArray){
      let filterParam={name:filter.key,value:this.customFilterValue[filter.key] ? 1 : 0}
      if(this.customFilterValue[filter.key]!=='all'){
        filtersArray.push(filterParam)
      }
    }

    for(let filter of this.referenceFilterArray){
      let filterParam={name:filter.key,value:this.customFilterValue[filter.key].trim().toLowerCase(),"op":"like"}
      if(this.customFilterValue[filter.key].trim()){
        filtersArray.push(filterParam)
      }
    }

    for(let filter of this.stringFilterArray){
      let filterParam={name:filter.key,value:this.customFilterValue[filter.key].trim().toLowerCase(),"op":"like"}
      if(this.customFilterValue[filter.key].trim()){
        filtersArray.push(filterParam)
      }
    }

    for(let filter of this.numberFilterArray){
      let min= this.customFilterValue[filter.key].min
      let max= this.customFilterValue[filter.key].max
      if(!(min==0 && max==0)){
        filtersArray.push({"name": filter.key,"value": min,"op": "gte"})
        filtersArray.push({"name": filter.key,"value": max,"op": "lte"})
      }
    }

    for(let filter of this.dateFilterArray){
      let start = this.customFilterValue[filter.key].start ? this.getSeconds(this.customFilterValue[filter.key].start) : 0
      let end = this.customFilterValue[filter.key].start ? this.getSeconds(this.customFilterValue[filter.key].end,true) : 0
      if(start && end){
        filtersArray.push({"name": filter.key,"value": start,"op": "gte"})
        filtersArray.push({"name": filter.key,"value": end,"op": "lte"})
      }
    }
    this.apiFilterParamsArray=filtersArray
    this.getTableData()
    this.pageNumber=0
  }

  getSeconds(date : any,end=false){
     let time= end ? new Date(new Date(date).setHours(23,59,59,99)) : new Date(new Date(date).setHours(0,0,0,0))
    return time
    // let time= end ? new Date(date).setHours(23,59,59,99) : new Date(date).setHours(0,0,0,0)
    // return Math.floor(time/1000)
  }

  getTableData(){
    if(!this.currentTableForm?.crud_get_enabled){
      this.ngxUiLoader.stopLoader('core-loader')
      return
    }
    let paramValue:any={
      filters:this.apiFilterParamsArray,
      "pagination":{"page_size": this.pageSize,"page_num": this.pageNumber+1},
    }
    if(this.sortItem.active && this.sortItem.direction){
      paramValue["sort"]=[{"name":this.sortItem.active,"order": this.sortItem.direction}]
    }
    let params:any={
      taql:JSON.stringify(paramValue)
    }
    if(this.page){
      this.getTableSubscription?.unsubscribe()
      this.getTableSubscription = this.sharedService.getCrudData(this.page,params).subscribe({
        next: (res)=>{
          this.dataList=_.cloneDeep(res.data)
          this.totalEntries=_.cloneDeep(res.total)
          this.dataSource=new MatTableDataSource(_.cloneDeep(this.dataList))
        },
        error: (error)=>{
          this.toast.error(error)
        }
      }
      )
    }
  }

  handlePageEvent(event:any){
    this.pageSize= event.pageSize
    this.pageNumber= event.pageIndex
    this.ngxUiLoader.startLoader('core-loader')
    this.getTableData()
  }

  addForm(action='add',element?:any){
    let dialogData:any= {
      title:`Add ${this.tableFormat?.display_name || this.tableFormat?.name}`,
      action: action,
      page:this.page,
      formData:this.currentTableForm,
      primaryKey:this.primaryKey
    }
    if(action=='edit' && element){
      dialogData.title=`Edit ${this.tableFormat?.display_name || this.tableFormat?.name}`
      dialogData.data=element
    }
    const val=this.sharedService.openDialog(CrudFormComponent,dialogData)
    val.subscribe({
      next: (res)=>{
        if(res){
          this.ngxUiLoader.startLoader('core-loader')
          this.getTableData()
        }
      }
    })
  }

  delete(element:any){
    let dialogData:any= {
      title:`Delete ${this.tableFormat?.display_name || this.tableFormat?.name}`,
      message:`Do you wish to delete this ${this.tableFormat?.display_name || this.tableFormat?.name}?`,
      action: 'Delete',
      page:this.page,
      data:element,
      primaryKey:this.primaryKey
    }
    const val=this.sharedService.openDialog(ConfirmComponent,dialogData,'50vw')
    val.subscribe({
      next: (res)=>{
        if(res){
          this.ngxUiLoader.startLoader('core-loader')
          this.getTableData()
        }
      }
    })
  }

  archive(element:any){
    let dialogData:any= {
      title:`Archive ${this.tableFormat?.display_name || this.tableFormat?.name}`,
      message:`Do you wish to archive this ${this.tableFormat?.display_name || this.tableFormat?.name}?`,
      action: 'Archive',
      page:this.page,
      data:element,
      primaryKey:this.primaryKey,
    }
    if(this.disableArchive){
      dialogData.disableArchive= this.disableArchive
      dialogData.message = `No value is configured for archiving ${this.tableFormat?.display_name || this.tableFormat?.name}.`
    }
    const val=this.sharedService.openDialog(ConfirmComponent,dialogData,'50vw')
    val.subscribe({
      next: (res)=>{
        if(res){
          this.ngxUiLoader.startLoader('core-loader')
          this.getTableData()
        }
      }
    })
  }

  sortTable(event:any){
    this.sortItem=event
    this.ngxUiLoader.startLoader('core-loader')
    this.getTableData()
  }

  getReference(col:any,element:any){
    let item:any =''
    if(col.reference){
      let dataArray = this.referenceTables[col?.reference?.table]
      item = dataArray?.find((item:any)=>(item?.[col?.reference?.column]==element?.[col.key]))
      item = item?.[col.reference.display] || item?.[col?.reference?.column]
    }
    return item
  }
}