import { Component, inject } from '@angular/core';
import { FeedService } from '../../services/feed.service';

@Component({
  selector: 'app-feed',
  imports: [],
  templateUrl:'./feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent {
  service = inject(FeedService);
  news = this.service.news;   
}
