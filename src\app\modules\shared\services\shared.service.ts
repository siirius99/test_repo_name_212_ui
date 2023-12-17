import { ComponentType } from '@angular/cdk/portal';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as _ from 'lodash'
import { config } from '../../../config'

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  apiUrl=config
  constructor(private router: Router,private http:HttpClient,private dialog: MatDialog) { }
  tableFormat:any = {}
  tableList:any[]=[]
  mainTableList:any[]=[]
  lookupTableList:any[]=[]
  lookupTableType=''
  mainTableType=''
  showSide=true
  paymentStatus:any=null
  showSubscription=false
  get loginUser(){
    let item=localStorage.getItem('loginUser')
    return item ? JSON.parse(item) : false 
  }

  get userData(){
    return JSON.parse(localStorage.getItem('userData') || '{}')
  }

  getTableSchema(){
    this.getData('schema').subscribe({
      next : (data)=>{
        this.tableFormat=data
        this.tableList=this.tableFormat.tables
        this.mainTableList=this.tableList.filter(el=>(el?.type==1))
        this.mainTableType=this.mainTableList?.[0]?.name
        this.lookupTableList=this.tableList.filter(el=>(el?.type==2))
        this.lookupTableType=this.mainTableList?.[0]?.name || this.lookupTableList?.[0]?.name
        // this.lookupTableType=this.lookupTableList?.[0]?.name
      },
      error : (err) => {}
    })
  }

  signOut(){
    localStorage.clear()
    this.paymentStatus=null
    this.router.navigate(['login'])
  }

  openDialog(Component: ComponentType<unknown>,data:any='',width:any='60vw'):Observable<any>{
    return this.dialog.open(Component,{width,data,minWidth:'300px'}).afterClosed()
  }

  getFile(entity:string,params:any={}):Observable<any>{
    return this.http.get(`${this.apiUrl}/${entity}`,{params:params,observe: 'response', responseType: 'blob'})
  }

  getData(entity:string,params:any={}):Observable<any>{
    return this.http.get(`${this.apiUrl}/${entity}`,{params:params})
  }

  postData(entity:string,data:any):Observable<any>{
    return this.http.post(`${this.apiUrl}/${entity}`,data)
  }

  putData(entity:string,data:any):Observable<any>{
    return this.http.put(`${this.apiUrl}/${entity}`,data)
  }

  deleteData(entity:string):Observable<any>{
    return this.http.delete(`${this.apiUrl}/${entity}`)
  }

  getCrudData(entity:string,params:any={}):Observable<any>{
    return this.http.get(`${this.apiUrl}/crud/${entity}`,{params:params})
  }

  postCrudData(entity:string,data:any):Observable<any>{
    return this.http.post(`${this.apiUrl}/crud/${entity}`,data)
  }

  putCrudData(entity:string,uuid:string,data:any):Observable<any>{
    return this.http.put(`${this.apiUrl}/crud/${entity}/${uuid}`,data)
  }

  deleteCrudData(entity:string,uuid:string):Observable<any>{
    return this.http.delete(`${this.apiUrl}/crud/${entity}/${uuid}`)
  }

  removeFieldWithNoValue(inputObj:any,edit=false): any{
    const restrictedValues  = ['' , undefined , 'undefined', null]
    Object.keys(inputObj).forEach((item) => {
      if(restrictedValues.includes(inputObj[item])){
        if(edit){
          inputObj[item]=null
        }
        else{
          delete inputObj[item]
        }
      }
    })
    return inputObj
  }

  getPaymentStatus(): Promise<any> {
    return new Promise((resolve, reject) => {
      if(this.userData?.is_admin){
        resolve('')
      }
      else{
        this.getData('project_meta').subscribe({
          next: (res) => {
            this.showSubscription = res.payment_configured
            if (res.payment_configured && !this.userData?.is_admin) {
              this.getData('payment_status').subscribe({
                next: (payment_res) => {
                  this.paymentStatus = payment_res
                  if(this.paymentStatus.plan){
                    let active_plan=this.paymentStatus.plans.find((i:any)=>(this.paymentStatus.plan==i?.value))
                    this.paymentStatus.plan_amount= active_plan.currency + active_plan.amount
                  }
                  resolve('')
                },
                error: (error) => {
                  reject('')
                }
              })
            }
            else {
              resolve('')
            }
          },
          error: (error) => {
            reject('')
          }
        })
      }
    })
  }

  public compare(a: number | string, b: number | string, isAsc: boolean) {
    if(typeof a === 'string' &&  typeof b === 'string'){
      return (a.toLowerCase() < b.toLowerCase() ? -1 : 1) * (isAsc ? 1 : -1)
    }
    else{
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1)
    }
  }

  public searchTableData(objectkeys: Array<string>, data: any, filter: string) {
    let doesEntryExist = false;
    if (data && Object.keys(data).length) {
      for (const keys of objectkeys) {
        let value = _.get(data, keys, '');
        if(keys=='plan_details'){
          value = (value?.currency || '')+(value?.actual_price || '')
        }
        value = value ? value + '' : '';
        if (value && (value.toLowerCase()).includes(filter.toLowerCase())) {
          doesEntryExist = true;
          break;
        }
      }
    }
    return doesEntryExist;
  }
}
