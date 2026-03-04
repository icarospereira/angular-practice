import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, merge, switchMap, timer, map, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

export interface News {
  items: any[];
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  private http = inject(HttpClient);

  private RSS = 'https://www.portugalresident.com/feed/';
  private URL = `https://api.rss2json.com/v1/api.json?rss_url=${this.RSS}`;


  private refresh$ = new Subject<void>();
  private autoRefresh$ = timer(0, 120000);

  readonly news = toSignal(
    merge(this.refresh$, this.autoRefresh$)
      .pipe(
        switchMap(() => this.fetchNews())
      ), { initialValue: [] }
  );

  refresh() {
    this.refresh$.next();
  }

  private fetchNews() {
    return this.http.get<News>(this.URL)
      .pipe(
        map(res => (res.items.slice(0, 3) || []).map(item => {

          const doc = new DOMParser().parseFromString(item.description, 'text/html');
          const imgTag = doc.querySelector('img');

          return {
            ...item,
            imgUrl: imgTag ? imgTag.src : '',
            cleanDescription: doc.body.textContent || ''
          };
        })),
        tap(res => console.log(res))
      )
  }
}
