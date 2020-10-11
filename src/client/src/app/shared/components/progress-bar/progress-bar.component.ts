import { Component, OnInit } from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent} from "@angular/router";
import {ProgressBarMode} from "@angular/material/progress-bar/progress-bar";
import {ProgressBarService} from "../../services/progress-bar/progress-bar.service";
import {ThemePalette} from "@angular/material/core/common-behaviors/color";

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {

  mode: ProgressBarMode = 'indeterminate';
  color: ThemePalette = 'primary';
  errorState = false;
  show: boolean;

  constructor(private router: Router,
              private progressBarService: ProgressBarService) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.handleLoadingProgress(event);
    });
    this.progressBarService.showProgressBar$.subscribe(showProgress => this.show = showProgress);
  }

  ngOnInit(): void {
  }

  private handleLoadingProgress(event: RouterEvent): void {
    switch (true) {
      case (event instanceof NavigationStart):
        this.color = 'primary';
        this.show = true;
        break;
      case (event instanceof NavigationEnd):
        this.show = false;
        break;
      case (event instanceof NavigationCancel):
      case (event instanceof NavigationError):
        this.errorState = true;
        this.color = 'warn'; // check for bug
        break;
    }
  }
}
