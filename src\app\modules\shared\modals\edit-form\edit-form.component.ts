import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss']
})
export class EditFormComponent implements OnInit{
  editForm!:FormGroup
  submitted=false
  constructor(
    private toast: ToastrService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedService: SharedService,
    private ngxUiLoader: NgxUiLoaderService
  ) {
    this.editForm=formBuilder.group({
      trial_days_left:['',Validators.required]
    })
  }

  ngOnInit(): void {
    this.editForm.patchValue({
      trial_days_left:this.data?.data?.allowed_trial_days
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }

  submitForm() {
    if(this.editForm.invalid){
      this.toast.error('Please enter all requried fields.')
      return
    }
    this.submitted=true
    let formData=this.editForm.getRawValue()
    formData.uuid=this.data.data.id
    this.ngxUiLoader.startLoader('core-loader')
    this.sharedService.putData(`client/info`,formData).subscribe({
      next:res=>{
        this.toast.success(res.message)
        this.dialogRef.close(true)
      },
      error:err=>{
        this.toast.error(err)
        this.submitted=false
      }
    })
    
  }
}
