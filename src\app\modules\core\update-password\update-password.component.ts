import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedService } from '../../shared/services/shared.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent {

  updatePasswordForm: FormGroup = this.fb.group({
    password:['',[Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)]],
    new_password:['',[Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)]],
    confirmPassword:['',[Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)]],
  });
  hide:boolean=true;
  passwordVisible:boolean=false;
  newPasswordVisible:boolean=false;
  cPasswordVisible:boolean=false;
  showForgotForm=true
  submitted=false
  constructor(private router: Router,private fb: FormBuilder,private toast: ToastrService,
    private sharedService:SharedService,private ngxUiLoader: NgxUiLoaderService
  ) {}

  updatePassword(){
    const formValue=this.updatePasswordForm.getRawValue()
    delete formValue.confirmPassword
    this.ngxUiLoader.startLoader('core-loader')
    this.submitted=true
    this.sharedService.postData('users/update_password',formValue).subscribe({
      next: (res)=>{
        this.toast.success(res.message)
        this.router.navigate([''])
      },
      error: (error)=>{
        this.toast.error(error)
        this.submitted=false
      }
    })
  }
}
