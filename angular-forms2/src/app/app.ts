import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Interviewform } from './features/interviewform/interviewform';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    Interviewform],
  templateUrl:'./app.html',
  styleUrls: [],
})
export class App {
 
}
