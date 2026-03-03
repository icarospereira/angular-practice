import { Component, input, output, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormComponent } from './components/form.component/form.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormComponent],
  templateUrl: './app.html',
  styleUrls: [],
})
export class App {
}
