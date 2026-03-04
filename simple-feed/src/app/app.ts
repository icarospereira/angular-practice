import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FeedComponent } from "./features/simple-feed/components/feed.component/feed.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FeedComponent],
  templateUrl: './app.html',
  styleUrls: [],
})
export class App { 
}
