import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../shared/services/shared.service';
import { title } from 'src/app/config';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{
  title=title
  signUpForm: FormGroup = this.fb.group({
    name:['',Validators.required],
    email:['',[Validators.required,Validators.email]],
    password:['',[Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)]],
    confirmPassword:['',[Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)]],
  });
  hide:boolean=true;
  passwordVisible:boolean=false;
  cPasswordVisible:boolean=false;
  utm_trial:any=null
  submitted=false;
  constructor(private router: Router,private fb: FormBuilder,private toast: ToastrService,
    private sharedService:SharedService,private route:ActivatedRoute,private ngxUiLoader: NgxUiLoaderService
  ) {
    if(sharedService.loginUser){
      if(sharedService.userData?.is_admin){
        this.router.navigate(['admin'])
      }
      else{
        this.router.navigate(['settings'])
      }
    }
  }

  ngOnInit() {
    let query:any=this.route.snapshot.queryParams
    if(query?.utm_trial){
      this.utm_trial=query.utm_trial
    }
  }

  signUp() : void {
    if(this.signUpForm?.invalid){
      this.toast.error('Please fill the details')
      return
    }
    let formValue=this.signUpForm.getRawValue()
    delete formValue.confirmPassword
    if(this.utm_trial){
      formValue.utm_trial=this.utm_trial
    }
    this.submitted=true
    this.ngxUiLoader.startLoader('core-loader')
    this.sharedService.postData('signup',formValue).subscribe({
      next: (res)=>{
        this.toast.success(res.message)
        localStorage.setItem('loginUser','true')
        localStorage.setItem('token',res.token)
        localStorage.setItem('userData',JSON.stringify(res.user))
        this.router.navigate(['settings'])
      },
      error: (error)=>{
        this.toast.error(error)
        this.submitted=false
      }
    })
    
  }
}
