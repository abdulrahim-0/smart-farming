import { Component } from '@angular/core';

@Component({
  selector: 'app-home-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrls: ['../../home-shared.css', './sidebar.css'],
  styles: [':host { display: contents; }'],
})
export class HomeSidebar {}
