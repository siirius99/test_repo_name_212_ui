import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { CoreComponent } from './core.component';
import { HomeComponent } from './home/home.component';
import { LookUpComponent } from './look-up/look-up.component';
import { TablesComponent } from './tables/tables.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';

const routes: Routes = [
  {
    path:'',
    component:CoreComponent,
    children:[
      {
        path:'payment',
        loadChildren:()=>import('../payment/payment.module').then(m=>(m.PaymentModule))
      },
      {
        path:'home',
        component:HomeComponent
      },
      {
        path:'about',
        component:AboutComponent
      },
      {
        path:'contact-us',
        component:ContactUsComponent
      },
      {
        path:'tables/:id',
        component:TablesComponent
      },
      {
        path:'settings',
        component:LookUpComponent
      },
      {
        path:'update-password',
        component:UpdatePasswordComponent
      },
      {
        path:'**',
        redirectTo:'/login'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
