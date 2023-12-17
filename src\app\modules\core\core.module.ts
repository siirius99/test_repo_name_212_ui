import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { CoreComponent } from './core.component';
import { SharedModule } from '../shared/shared.module';
import { LayoutModule } from '../layout/layout.module';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablesComponent } from './tables/tables.component';
import { LookUpComponent } from './look-up/look-up.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';


@NgModule({
  declarations: [
    CoreComponent,
    HomeComponent,
    AboutComponent,
    ContactUsComponent,
    TablesComponent,
    LookUpComponent,
    UpdatePasswordComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    CoreRoutingModule
  ]
})
export class CoreModule { }
