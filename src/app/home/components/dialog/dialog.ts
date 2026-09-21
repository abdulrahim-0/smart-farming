import { Component, input, output } from '@angular/core';
import { Sensor } from '../../sensor';

@Component({
  selector: 'app-sensor-dialog',
  imports: [],
  templateUrl: './dialog.html',
  styleUrls: ['../../home-shared.css', './dialog.css'],
  styles: [':host { display: contents; }'],
})
export class SensorDialog {
  readonly adding = input(false);
  readonly selected = input<Sensor | null>(null);
  readonly closed = output<void>();
  readonly submitted = output<Event>();
}
