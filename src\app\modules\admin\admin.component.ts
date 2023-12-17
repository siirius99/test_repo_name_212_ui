import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EditFormComponent } from '../shared/modals/edit-form/edit-form.component';
import { SharedService } from '../shared/services/shared.service';
import * as _ from 'lodash'
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit{
  @ViewChild(MatSort) sort: MatSort | undefined
  dataSource = new MatTableDataSource<any>();
  usersList:any
  loading=false
  displayedColumns: string[] = ['name', 'email','allowed_trial_days','created_timestamp', 'payment_status','account_status','plan_details','plan', 'action'];
  kpiData:any=null
  searchQuery:any=''
  constructor(public sharedService: SharedService,private router: Router,private toast: ToastrService,private ngxUiLoader: NgxUiLoaderService){
    if(!sharedService.userData.is_admin){
      this.router.navigateByUrl('/login')
    }
  }

  ngOnInit(): void {
    this.ngxUiLoader.startLoader('core-loader')
    this.getUsers()
    this.getKpiData()
  }

  getUsers(){
    this.loading=true
    this.sharedService.getData('client/info').subscribe({
      next :(res)=>{
        this.usersList = res;
        this.usersList.sort((a:any,b:any)=>(b.created_timestamp-a.created_timestamp))
        this.dataSource=new MatTableDataSource(this.usersList)
        this.setFilter()
        this.loading=false
      },
      error :(err)=>{
        this.loading=false
        this.toast.error(err)
      }
    })
  }

  getKpiData(){
    this.loading=true
    this.sharedService.getData('client/kpi').subscribe({
      next :(res)=>{        
        this.kpiData = res
        this.loading=false
      },
      error :(err)=>{
        this.loading=false
        this.toast.error(err)
      }
    })
  }

  public sortData(sort: Sort): any{
    const data = _.cloneDeep(this.usersList)
    let sortedData = []
    if (!sort.active || sort.direction === '') {
      sortedData = data
      return
    }
    sortedData = data.sort((a:any, b:any) => {
      const isAsc = sort.direction === 'asc'
      if(sort.active=='plan_details'){
        return (this.sharedService.compare((a[sort.active]['actual_price'] || ''), (b[sort.active]['actual_price'] || ''), isAsc) || 0)
      }
      return sort.active=='action' ? 0 : (this.sharedService.compare((a[sort.active] || ''), (b[sort.active] || ''), isAsc) || 0)
    })
    this.dataSource = new MatTableDataSource(sortedData)
    this.setFilter()
    this.applyFilter()
  }

  edit(element:any){
    let dialogData:any= {
      title:`Set trial days`,
      data:element,
    }
    const value=this.sharedService.openDialog(EditFormComponent,dialogData,'50vw')
    value.subscribe({
      next: (res)=>{
        if(res){
          this.ngxUiLoader.startLoader('core-loader')
          this.getUsers()
        }
      }
    })
  }

  applyFilter() {
    let filterValue = this.searchQuery.trim(); // Remove whitespace
    filterValue = this.searchQuery.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  setFilter(){
    this.dataSource.filterPredicate = (data, filter) => {
      let result:boolean =  this.sharedService.searchTableData(['name', 'email','allowed_trial_days','payment_status','account_status','plan_details','plan'],data,filter);
      return result;
    }
  }

}
