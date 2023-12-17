import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignInComponent } from './sign-in/sign-in.component';

const routes: Routes = [
  {
    path:'',
    component:SignInComponent
  },
  {
    path:'login',
    component:SignInComponent
  },
  {
    path:'register',
    component:RegisterComponent
  },
  {
    path: 'forgot-password',
    component:ResetPasswordComponent
  },
  {
    path: 'reset-password',
    component:ResetPasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
