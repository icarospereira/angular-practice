import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn, FormGroup, FormControl, FormControlName } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';


interface Country {
  id: number;
  countryName: string;
  cities: string[];
}

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private baseform = inject(FormBuilder);

  public form: FormGroup = this.baseform.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    gender: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.pattern('^([a-z0-9]+)([.-]?[a-z0-9]+)*\@([a-z0-9]+)([.-]?[a-z0-9]+)*\.([a-z0-9]{2,})$')]],
    nif: ['', [Validators.required, this.nifValidator]],
    birthDate: ['', [Validators.required, this.birthDateValidator(18)]],
    country: ['', [Validators.required]],
    city: ['', [Validators.required]],
    address: ['', [Validators.required]],
    postalCode: ['', [Validators.required]],
    phone: ['', [Validators.required, this.phoneValidator]]
  });


  readonly countries = signal<Country[]>([
    { 'id': 0, 'countryName': 'Alemanha', 'cities': ['Frankfurt', 'Berlim'] },
    { 'id': 1, 'countryName': 'Espanha', 'cities': ['Madrid', 'Barcelona'] },
    { 'id': 2, 'countryName': 'França', 'cities': ['Paris', 'Marselha'] },
    { 'id': 3, 'countryName': 'Inglaterra', 'cities': ['Londres', 'Liverpool'] },
    { 'id': 4, 'countryName': 'Portugal', 'cities': ['Lisboa', 'Porto'] }
  ])

  private PT_POSTAL_CODE = /^\d{4}-\d{3}$/;
  private GENERIC_POSTAL_CODE = /^\d{5}-\d{3}$/;

  private selCountry = toSignal(this.form.get('country')!.valueChanges, {initialValue: ''});
  private pcRegex = computed(() => this.selCountry() === 'Portugal' ? this.PT_POSTAL_CODE : this.GENERIC_POSTAL_CODE);
  

//------------ Seleção das cidades------------- 
  cities = computed(() => {
    const country = this.selCountry();
    const name = this.countries().find(c => c.countryName === country);
    this.form.get('city')?.reset('');
    if (name) {      
      return name.cities;
    }
    return [];
  });  


//-----------Validação de Codigo Postal--------------
constructor(){
  effect(()=>{
    const pcControl = this.form.get('postalCode') as FormControl;      
    const pcRegexPattern = this.pcRegex();
    pcControl.setValidators([Validators.required, Validators.pattern(pcRegexPattern)]);
    pcControl.updateValueAndValidity();
  });
}

//--------------------------------------------

  birthDateValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const birth = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      
      return age >= minAge ? null : { underAge: true };
    };
  }

  phoneValidator(control: AbstractControl): ValidationErrors | null {
    const phone = String(control.value);
    const validPrefixes = ['2', '3', '9'];

    if (!phone || !/^\d{9}$/.test(phone)) {
      return { erro: true };
    }

    if (!validPrefixes.includes(phone[0])) {
      return { erro: true };
    }

    return null;
  }

  nifValidator(control: AbstractControl): ValidationErrors | null {
    const nif = String(control.value);

    const validPrefixes = ['1', '2', '3', '4', '5', '6', '8', '9'];
    let sum = 0;
    let digitChecker = 0;

    if (!nif || !/^\d{9}$/.test(nif)) {
      return { erro: true };
    }

    if (!validPrefixes.includes(nif[0])) {
      return { erro: true };
    }

    for (let i = 0; i < 8; i++) {
      sum += Number(nif[i]) * (10 - 1- i);
    }

    let rest = sum % 11;

    if (rest == 0 || rest == 1) {
      digitChecker = 0;
    } else { digitChecker = 11 - rest }

    if (digitChecker != Number(nif[8])) {
      console.log(digitChecker);
      return { erro: true };
    }

    return null;
  }

  getData() {
    return this.form.getRawValue();
  }

}
