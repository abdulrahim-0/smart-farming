import { Component } from '@angular/core';

@Component({
  selector: 'app-home-header',
  imports: [],
  templateUrl: './header.html',
  styleUrls: ['../../home-shared.css', './header.css'],
  styles: [':host { display: contents; }'],
})
export class HomeHeader {}
