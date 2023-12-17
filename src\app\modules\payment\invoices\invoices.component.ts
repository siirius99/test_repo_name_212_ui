import { Component, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../shared/services/shared.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent {
  @ViewChild(MatSort) sort: MatSort | undefined
  dataSource = new MatTableDataSource<any>();
  paymentInvoiceData:any
  loading=false
  displayedColumns: string[] = ['type','amount_in_cents','quantity','invoice_created_at','invoice_paid_at','status','edit']
  constructor(public sharedService: SharedService,private toast: ToastrService){
    this.getInvoicesData()
  }

  getInvoicesData(){
    this.loading=true
    this.sharedService.getData('subscription/invoices').subscribe({
      next :(res)=>{
        this.paymentInvoiceData = res['data'];
        this.paymentInvoiceData.sort((a:any,b:any)=>(b.invoice_created_at-a.invoice_created_at))
        this.dataSource=new MatTableDataSource(this.paymentInvoiceData )
        this.loading=false
      },
      error :(err)=>{
        this.loading=false
        this.toast.error(err)
      }
    })
  }

  public sortData(sort: Sort): any{
    const data = this.dataSource.filteredData.slice()
    let sortedData = []
    if (!sort.active || sort.direction === '') {
      sortedData = data
      return
    }
    sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc'
      switch (sort.active) {
        case 'type': return this.sharedService.compare(a.type, b.type, isAsc)
        case 'amount_in_cents': return this.sharedService.compare(a.amount_in_cents, b.amount_in_cents, isAsc)
        case 'invoice_created_at': return this.sharedService.compare(a.invoice_created_at, b.invoice_created_at, isAsc)
        case 'invoice_paid_at': return this.sharedService.compare(a.invoice_paid_at, b.invoice_paid_at, isAsc)
        case 'status': return this.sharedService.compare(a.status, b.status, isAsc)
        default: return 0
      }
    })
    this.dataSource = new MatTableDataSource(sortedData)
  }

  downloadInvoice(element:any){
    this.sharedService.getData(`sinvoice/${element?.stripe_invoice_id}/details`).subscribe({
      next :res=>{
        window.open(res.invoiceURL, '_blank');
      },
      error :()=>{
        window.open(element.hosted_invoice_url, '_blank');
      }
    });
  }
}
