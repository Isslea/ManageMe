import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'ManageMe';
  projectId!: string;
  epicId!: string;
  words: string[] = ["projects", "epics", "tasks", "details", "create", "edit"];
  constructor(private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const segments = event.url.split('/').filter(segment => segment !== '');
        if (segments.length > 0 && this.words.includes(segments[0])) {
          this.projectId = '';
        } else {
          this.projectId = segments[0];
        }

        if (segments.length > 1 && this.words.includes(segments[1])) {
          this.epicId = '';
        } else {
          this.epicId = segments[1];
        }
      }
    });
}



}
