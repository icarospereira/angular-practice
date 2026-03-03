import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form.component.html',
  styleUrls: [],
})
export class FormComponent implements OnInit{
  private baseform = inject(FormBuilder);
  private readonly STORAGE_KEY = 'registration_data';

  form = this.baseform.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    role: ['guest', Validators.required]
  });

  ngOnInit(): void {
      const savedData = localStorage.getItem(this.STORAGE_KEY);
      if (savedData){
        this.form.patchValue(JSON.parse(savedData));
      }

      this.form.valueChanges.subscribe(value =>{
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(value));
      });
  }

  onSubmit(){
    if (this.form.valid){
      console.log('Dados enviados: ', this.form.value);
    }else {
      this.form.markAllAsTouched();
    }
  }
}
