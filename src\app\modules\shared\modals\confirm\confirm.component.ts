import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit{
  constructor(
    private toast : ToastrService,
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  submit(){
    this.sharedService.deleteCrudData(this.data.page,this.data.data[this.data.primaryKey]).subscribe({
      next: (res)=>{
        this.toast.success(res.message)
        this.dialogRef.close(true);
      },
      error: (error)=>{
        this.toast.error(error)
      }
    })
    // if(this.data.action=='Delete'){
    //   this.sharedService.deleteCrudData(this.data.page,this.data.data[this.data.primaryKey]).subscribe({
    //     next: (res)=>{
    //       this.toast.success(res.message)
    //       this.dialogRef.close(true);
    //     },
    //     error: (error)=>{
    //       this.toast.error(error)
    //     }
    //   })
    // }
    // if(this.data.action=='Archive'){
    //   this.sharedService.putCrudData(this.data.page,this.data.data[this.data.primaryKey],{active:0}).subscribe({
    //     next: (res)=>{
    //       this.toast.success(res.message)
    //       this.dialogRef.close(true);
    //     },
    //     error: (error)=>{
    //       this.toast.error(error)
    //     }
    //   })
    // }
    
  }

  confirm(){
    this.dialogRef.close(true);
  }
}
