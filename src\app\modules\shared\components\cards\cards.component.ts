import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { SharedService } from '../../services/shared.service';


export const TEAM_LIST=[
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "designation": "CEO",
    "description": "John is the founder and CEO of our company.",
    "profile_image": '../../../../../assets/images/profile.png'
  },
  {
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "designation": "COO",
    "description": "Jane is the Chief Operating Officer of our organization.",
    "profile_image": '../../../../../assets/images/profile.png'
  },
  {
    "name": "Michael Johnson",
    "email": "michael.johnson@example.com",
    "designation": "CTO",
    "description": "Michael is our Chief Technology Officer and leads our technical team.",
    "profile_image": '../../../../../assets/images/profile.png'
  },
  {
    "name": "Emily Davis",
    "email": "emily.davis@example.com",
    "designation": "CFO",
    "description": "Emily is the Chief Financial Officer and manages our finances.",
    "profile_image": '../../../../../assets/images/profile.png'
  },
  {
    "name": "David Wilson",
    "email": "david.wilson@example.com",
    "designation": "CMO",
    "description": "David is the Chief Marketing Officer and handles our marketing strategies.",
    "profile_image": '../../../../../assets/images/profile.png'
  },
  {
    "name": "Lisa Brown",
    "email": "lisa.brown@example.com",
    "designation": "HR Manager",
    "description": "Lisa is our Human Resources Manager and takes care of HR functions.",
    "profile_image": '../../../../../assets/images/profile.png'
  },
  {
    "name": "Andrew Miller",
    "email": "andrew.miller@example.com",
    "designation": "Product Manager",
    "description": "Andrew is our Product Manager and oversees product development.",
    "profile_image": '../../../../../assets/images/profile.png'
  },
  {
    "name": "Jessica Lee",
    "email": "jessica.lee@example.com",
    "designation": "Sales Manager",
    "description": "Jessica is our Sales Manager and leads the sales team.",
    "profile_image": '../../../../../assets/images/profile.png'
  },
  {
    "name": "Daniel White",
    "email": "daniel.white@example.com",
    "designation": "Software Engineer",
    "description": "Daniel is a Software Engineer and works on software development.",
    "profile_image": '../../../../../assets/images/profile.png'
  },
  {
    "name": "Sophia Green",
    "email": "sophia.green@example.com",
    "designation": "Marketing Coordinator",
    "description": "Sophia is a Marketing Coordinator responsible for marketing campaigns.",
    "profile_image": '../../../../../assets/images/profile.png'
  },
  {
    "name": "Matthew Hall",
    "email": "matthew.hall@example.com",
    "designation": "Graphic Designer",
    "description": "Matthew is our Graphic Designer and creates visual content.",
    "profile_image": '../../../../../assets/images/profile.png'
  },
  {
    "name": "Olivia Adams",
    "email": "olivia.adams@example.com",
    "designation": "Content Writer",
    "description": "Olivia is a Content Writer responsible for creating written content.",
    "profile_image": '../../../../../assets/images/profile.png'
  },
  {
    "name": "Ethan Harris",
    "email": "ethan.harris@example.com",
    "designation": "IT Support Specialist",
    "description": "Ethan is an IT Support Specialist and assists with technical issues.",
    "profile_image": '../../../../../assets/images/profile.png'
  },
  {
    "name": "Ava Clark",
    "email": "ava.clark@example.com",
    "designation": "Customer Support Representative",
    "description": "Ava handles customer inquiries and support requests.",
    "profile_image": '../../../../../assets/images/profile.png'
  },
  {
    "name": "Noah Turner",
    "email": "noah.turner@example.com",
    "designation": "Data Analyst",
    "description": "Noah is a Data Analyst responsible for data analysis and reporting.",
    "profile_image": '../../../../../assets/images/profile.png'
  },
  {
    "name": "Lily Baker",
    "email": "lily.baker@example.com",
    "designation": "Web Developer",
    "description": "Lily is a Web Developer working on website development.",
    "profile_image": '../../../../../assets/images/profile.png'
  },
  {
    "name": "James Martin",
    "email": "james.martin@example.com",
    "designation": "Marketing Manager",
    "description": "James is the Marketing Manager responsible for marketing strategies.",
    "profile_image": '../../../../../assets/images/profile.png'
  },
  {
    "name": "Chloe Rodriguez",
    "email": "chloe.rodriguez@example.com",
    "designation": "HR Assistant",
    "description": "Chloe assists with HR-related tasks and employee support.",
    "profile_image": '../../../../../assets/images/profile.png'
  },
  {
    "name": "Benjamin Young",
    "email": "benjamin.young@example.com",
    "designation": "Quality Assurance Tester",
    "description": "Benjamin tests our software products for quality and reliability.",
    "profile_image": '../../../../../assets/images/profile.png'
  },
  {
    "name": "Mia Lewis",
    "email": "mia.lewis@example.com",
    "designation": "Project Manager",
    "description": "Mia is a Project Manager responsible for project planning and execution.",
    "profile_image": '../../../../../assets/images/profile.png'
  },
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "designation": "CEO",
    "description": "John is the founder and CEO of our company.",
    "profile_image": '../../../../../assets/images/profile.png'
  },
  {
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "designation": "COO",
    "description": "Jane is the Chief Operating Officer of our organization.",
    "profile_image": '../../../../../assets/images/profile.png'
  },
  {
    "name": "Michael Johnson",
    "email": "michael.johnson@example.com",
    "designation": "CTO",
    "description": "Michael is our Chief Technology Officer and leads our technical team.",
    "profile_image": '../../../../../assets/images/profile.png'
  },
  {
    "name": "Emily Davis",
    "email": "emily.davis@example.com",
    "designation": "CFO",
    "description": "Emily is the Chief Financial Officer and manages our finances.",
    "profile_image": '../../../../../assets/images/profile.png'
  },
  {
    "name": "David Wilson",
    "email": "david.wilson@example.com",
    "designation": "CMO",
    "description": "David is the Chief Marketing Officer and handles our marketing strategies.",
    "profile_image": '../../../../../assets/images/profile.png'
  },
]

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})

export class CardsComponent implements OnInit {
  @ViewChild('paginator') paginator!: MatPaginator;

  @Input() page:any=''
  @Input() displayedColumnsDetail: any[] = [];
  @Input() taqlQuery:any={}
  @Input() cardType:any='profile'
  displayedColumns: string[] = [];

  dataList:any[]=[]
  optionsArray=[{name:'All',value:'all'},{name:'Yes',value:true},{name:'No',value:false}]
  customFilterValue:any={}
  booleanFilterArray:any[]=[]
  dateFilterArray:any[]=[]
  stringFilterArray:any[]=[]
  numberFilterArray:any[]=[]
  getTableSubscription: Subscription | any;
  apiFilterParamsArray:any[]=[]
  totalEntries=0
  pageSize=10
  pageNumber=0
  cardStructure:any={}
  constructor(private sharedService: SharedService){}

  ngOnInit(): void {
    this.totalEntries=TEAM_LIST.length
    this.dataList=TEAM_LIST
    this.dataList = this.dataList.slice(this.pageSize*this.pageNumber,this.pageSize*(this.pageNumber+1))
    this.cardStructure={}
    this.displayedColumnsDetail = [
      {name:'Name',key:'name',type:'string',section:'title'},
      {name:'Designation',key:'designation',type:'string',section:'subtitle'},
      {name:'Description',key:'description',type:'string',section:'detail'},
      {name:'Image',key:'profile_image',type:'image',section:'image'},
    ]
    this.displayedColumnsDetail.forEach((item:any)=>{
      this.cardStructure[item.section]=item.key
    })
    this.getTableData()
    // this.setFilter()
  }

  setFilter(){
    this.displayedColumns=[]
    for(let item of this.displayedColumnsDetail){
      this.displayedColumns.push(item.key)
      this.displayedColumns.push()
      if(item.type=='boolean'){
        this.booleanFilterArray.push({name:item.name,key:item.key})
        this.customFilterValue[item.key]='all'
      }
      else if(item.type=='date'){
        this.dateFilterArray.push({name:item.name,key:item.key})
        this.customFilterValue[item.key]={start:'../../../../../assets/images/profile.png',end:'../../../../../assets/images/profile.png'}
      }
      else if(item.type=='string'){
        this.stringFilterArray.push({name:item.name,key:item.key})
        this.customFilterValue[item.key]=''
      }
      else if(item.type=='number'){
        this.numberFilterArray.push({name:item.name,key:item.key})
        this.customFilterValue[item.key]={min:0,max:0}
      }
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
    let time= end ? new Date(date).setHours(23,59,59,99) : new Date(date).setHours(0,0,0,0)
    return Math.floor(time/1000)
  }

  getTableData(){
    // let params:any={
    //   taql:JSON.stringify({
    //     filters:this.apiFilterParamsArray,
    //     "pagination":{"page_size": this.pageSize,"page_num": this.pageNumber+1},
    //     ...this.taqlQuery
    //   })
    // }
    // if(this.page){
    //   this.getTableSubscription?.unsubscribe()
    //   this.getTableSubscription = this.sharedService.getCrudData(this.page,params).subscribe(
    //     (res:any)=>{
    //       this.dataList=_.cloneDeep(res.data)
    //       this.totalEntries=_.cloneDeep(res.total)
    //     }
    //   )
    // }
  }

  handlePageEvent(event:any){
    this.pageSize= event.pageSize
    this.pageNumber= event.pageIndex
    this.dataList = TEAM_LIST.slice(this.pageSize*this.pageNumber,this.pageSize*(this.pageNumber+1))
    this.totalEntries=TEAM_LIST.length
    // this.getTableData()
  }
}
