import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';
import { findIndex } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-crud-form',
  templateUrl: './crud-form.component.html',
  styleUrls: ['./crud-form.component.scss'],
})
export class CrudFormComponent {
  formGroup!: FormGroup;
  fieldsList: any[] = [];
  submitted = false
  constructor(
    private toast: ToastrService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedService: SharedService,
    private ngxUiLoader: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.generateForm();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  submitForm() {
    if (this.formGroup.valid) {
      let formValue:any = _.cloneDeep(this.formGroup.value);
      formValue=this.sharedService.removeFieldWithNoValue(formValue,this.data.action!=='add')
      this.fieldsList.forEach((item: any) => {
        if (item.data_type == 'boolean' || (item.data_type == 'int' && item.field == 'checkbox')) {
          formValue[item.key] = formValue[item.key] ? 1 : 0;
        }
        // if ((item.field == 'date' || item.data_type == 'datetime') && formValue[item.key]) {
        //   formValue[item.key] = Math.floor(
        //     new Date(formValue[item.key]).getTime() / 1000
        //   );
        // }
      });
      this.submitted=true
      if(this.data.action=='add'){
        this.ngxUiLoader.startLoader('core-loader')
        this.sharedService.postCrudData(this.data.page,formValue).subscribe({
          next: (res)=>{
            this.toast.success(res.message)
            this.dialogRef.close(true);
          },
          error: (error)=>{
            this.toast.error(error)
            this.submitted=false
          }
        })
      }
      else{
        this.ngxUiLoader.startLoader('core-loader')
        this.sharedService.putCrudData(this.data.page,this.data.data[this.data.primaryKey],formValue).subscribe({
          next: (res)=>{
            this.toast.success(res.message)
            this.dialogRef.close(true);
          },
          error: (error)=>{
            this.toast.error(error)
            this.submitted=false
          }
        })
      }
    }
  }

  generateForm() {
    this.fieldsList = [];
    let form = this.formBuilder.group({});
    for (let key of Object.keys(this.data.formData.external_fields)) {
      let formItem = {
        ...{ key: key },
        ...this.data.formData.external_fields[key],
      };
      if (!(formItem.session || formItem.primary) && ((this.data.action=='edit' && formItem.alterable) || this.data.action!=='edit')) {
        let defaultValue = formItem?.options?.default || '';
        if(this.data.action=='edit' && this.data.data){
          defaultValue = this.data.data[key] || '';
        }
        let validator = [];
        if (formItem?.required) {
          validator.push(Validators.required);
        }
        if (
          formItem?.data_type == 'varchar' ||
          formItem?.data_type == 'string'
        ) {
          if (formItem?.options?.max_length) {
            validator.push(Validators.maxLength(formItem?.options?.max_length));
          }
          if (formItem?.options?.min_length) {
            validator.push(Validators.minLength(formItem?.options?.min_length));
          }
          if (formItem?.options?.sub_type == 'date') {
            formItem.field = 'date';
          } else if (formItem?.options?.values) {
            formItem.field = 'select';
            formItem.optionValues = formItem?.options?.values;
          } else {
            formItem.field = 'text';
          }
          form.addControl(
            key,
            this.formBuilder.control(defaultValue, validator)
          );
        } else if (
          formItem?.data_type == 'number' ||
          formItem?.data_type == 'int' ||
          formItem?.data_type == 'double'
        ) {
          if (formItem?.options?.max) {
            validator.push(Validators.max(formItem?.options?.max));
          }
          if (formItem?.options?.min) {
            validator.push(Validators.min(formItem?.options?.min));
          }
          if (formItem?.options?.sub_type == 'boolean') {
            formItem.field = 'checkbox';
            defaultValue = defaultValue == 1 ? true : false;
            form.addControl(
              key,
              this.formBuilder.control(defaultValue, validator)
            );
          } else if (formItem?.data_type == 'double') {
            formItem.field = 'double';
            form.addControl(
              key,
              this.formBuilder.control(defaultValue, validator)
            );
          } else {
            formItem.field = 'number';
            form.addControl(
              key,
              this.formBuilder.control(defaultValue, validator)
            );
          }
        } else if (formItem?.data_type == 'boolean') {
          formItem.field = 'checkbox';
          defaultValue = defaultValue == 1 ? true : false;
          form.addControl(
            key,
            this.formBuilder.control(defaultValue, validator)
          );
        } else if (
          formItem?.data_type == 'date' ||
          formItem?.data_type == 'datetime'
        ) {
          formItem.field = 'date';
          form.addControl(
            key,
            this.formBuilder.control(defaultValue, validator)
          );
        } else {
          formItem.field = 'text';
          form.addControl(
            key,
            this.formBuilder.control(defaultValue, validator)
          );
        }
        if (formItem.reference.table) {
          formItem.field = 'reference';
          formItem.reference.display= formItem.reference.display || 'name'
          this.sharedService.getCrudData(formItem.reference.table).subscribe({
            next: (data)=>{
              formItem.optionValues=data.data
            },
            error: (err)=>{
              // formItem.optionValues=[{id:1,name:'One'},{id:2,name:'Two'},{id:2,name:'Three'}]
            }
          })
        }
        this.fieldsList.push(formItem);
      }
    }
    this.formGroup = form;
  }
}
