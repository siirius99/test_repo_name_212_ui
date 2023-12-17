import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent {
  contactForm: FormGroup;

  constructor(private formBuilder: FormBuilder,private toast: ToastrService) {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      message: ['', Validators.required],
      howDidYouHear: [''],
      contactOptions: this.formBuilder.group({
        phone: false,
        email: false,
      })
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      // Handle form submission here
      // Access form values using this.contactForm.value
      this.toast.success('Form submitted successfully')
      console.log(this.contactForm.value);

    }
  }
}
