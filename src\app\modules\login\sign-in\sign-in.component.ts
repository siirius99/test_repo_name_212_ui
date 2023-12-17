import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../shared/services/shared.service';
import { title } from 'src/app/config'
import { Location } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  title=title
  loginForm: FormGroup = this.fb.group({
    email:['',[Validators.required,Validators.email]],
    password:['',Validators.required]
  });
  hide:boolean=true;
  passwordVisible:boolean=false;
  submitted=false
  constructor(private router: Router,private fb: FormBuilder,private toast: ToastrService,
    private sharedService:SharedService,private location:Location,private ngxUiLoader: NgxUiLoaderService
  ) {
    if(!router.url.includes('login')){
      location.go('login')
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

  login() : void {
    if(this.loginForm?.invalid){
      this.toast.error('Please fill the details')
      return
    }
    this.submitted=true
    const formValue=this.loginForm.getRawValue()
    this.ngxUiLoader.startLoader('core-loader')
    this.sharedService.postData('login',formValue).subscribe({
      next: (res)=>{
        this.toast.success(res.message)
        localStorage.setItem('loginUser','true')
        localStorage.setItem('token',res.token)
        localStorage.setItem('userData',JSON.stringify(res.user))
        if(res.user?.is_admin){
          this.router.navigate(['admin'])
        }
        else{
          this.router.navigate(['settings'])
        }
      },
      error: (error)=>{
        this.submitted=false
        this.toast.error(error)
      }
    })
  }
}
