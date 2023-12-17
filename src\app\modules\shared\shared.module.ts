import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from './angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from './components/table/table.component';
import { CardsComponent } from './components/cards/cards.component';
import { CrudFormComponent } from './modals/crud-form/crud-form.component';
import { IntegerInputDirective } from './directives/integer-input.directive';
import { ConfirmComponent } from './modals/confirm/confirm.component';
import { EditFormComponent } from './modals/edit-form/edit-form.component';


@NgModule({
  declarations: [
    TableComponent,
    CardsComponent,
    CrudFormComponent,
    EditFormComponent,
    IntegerInputDirective,
    ConfirmComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
  ],
  exports:[
    AngularMaterialModule,
    TableComponent,
    CardsComponent,
    IntegerInputDirective
  ]
})
export class SharedModule { }
