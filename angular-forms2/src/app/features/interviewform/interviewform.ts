import { Component, inject, computed } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormService } from './services/form.service';


@Component({
  selector: 'app-interviewform',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './interviewform.html',
  styleUrls: ['./interviewform.css'],
})
export class Interviewform {

  public interviewForm = inject(FormService);

  Submit() {
    if (this.interviewForm.form.valid) {
      const data = this.interviewForm.getData();
      console.log('ok', data);
    }
  }

}
