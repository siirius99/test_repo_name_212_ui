import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentStatusComponent } from './modules/payment/payment-status/payment-status.component';

const routes: Routes = [
  {
    path:'',
    children:[
      {
        path:'payment_failure',
        component:PaymentStatusComponent
      },
      {
        path:'payment_success',
        component:PaymentStatusComponent
      },
      {
        path:'admin',
        loadChildren:()=>import('./modules/admin/admin.module').then(m=>(m.AdminModule))
      },
      {
        path:'',
        loadChildren:()=>import('./modules/login/login.module').then(m=>(m.LoginModule))
      },
      {
        path:'',
        loadChildren:()=>import('./modules/core/core.module').then(m=>(m.CoreModule))
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
