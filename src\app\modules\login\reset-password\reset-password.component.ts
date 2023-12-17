import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { title } from 'src/app/config';
import { SharedService } from '../../shared/services/shared.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  title=title
  forgotPasswordForm: FormGroup = this.fb.group({
    email:['',[Validators.required,Validators.email]],
  });

  resetPasswordForm: FormGroup = this.fb.group({
    email:['',[Validators.required,Validators.email]],
    password:['',[Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)]],
    confirmPassword:['',[Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)]],
    otp:['',Validators.required]
  });
  hide:boolean=true;
  passwordVisible:boolean=false;
  cPasswordVisible:boolean=false;
  showForgotForm=true
  submitted=false
  constructor(private router: Router,private fb: FormBuilder,private toast: ToastrService,
    private sharedService:SharedService,private location:Location,private ngxUiLoader: NgxUiLoaderService
  ) {
    this.showForgotForm=router.url.includes('forgot-password')
    if(!this.showForgotForm){
      let email=localStorage.getItem('forgotFormEmail')
      if(email){
        this.resetPasswordForm.patchValue({email:email})
      }
      else{
        router.navigateByUrl('forgot-password')
      }
    }
    if(sharedService.loginUser){
      if(sharedService.userData?.is_admin){
        this.router.navigate(['admin'])
      }
      else{
        this.router.navigate(['settings'])
      }
    }
  }

  ngOnInit() {}

  submit() : void {
    if(this.forgotPasswordForm?.invalid){
      this.toast.error('Please fill the details')
      return
    }
    this.submitted=true
    const formValue=this.forgotPasswordForm.getRawValue()
    this.ngxUiLoader.startLoader('core-loader')
    this.sharedService.postData('users/forgot_password',formValue).subscribe({
      next: (res)=>{
        this.toast.success(res.message)
        localStorage.setItem('forgotFormEmail',this.forgotPasswordForm.value.email)
        this.router.navigate(['reset-password'])
      },
      error: (error)=>{
        this.toast.error(error)
        this.submitted=false
      }
    })
  }

  resetPassword(){
    const formValue=this.resetPasswordForm.getRawValue()
    delete formValue.confirmPassword
    this.submitted=true
    this.ngxUiLoader.startLoader('core-loader')
    this.sharedService.postData('users/reset_password',formValue).subscribe({
      next: (res)=>{
        this.toast.success(res.message)
        this.router.navigate(['login'])
      },
      error: (error)=>{
        this.submitted=false
        this.toast.error(error)
      }
    })
  }
}
