import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FeedComponent } from './features/feed/components/feed.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FeedComponent],
  templateUrl: './app.html',
  styleUrls: [],
})
export class App {
  
}
