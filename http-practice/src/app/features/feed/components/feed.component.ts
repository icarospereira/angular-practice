import { Component, inject } from '@angular/core';
import { FeedService } from '../services/feed.service';
import { ReactiveFormsModule } from '@angular/forms';



@Component({
  selector: 'app-feed',
  imports: [ReactiveFormsModule],
  templateUrl:'./feed.component.html',
  styleUrls:[],
})
export class FeedComponent {
  public service = inject(FeedService);
  public form = this.service.form;   
}
