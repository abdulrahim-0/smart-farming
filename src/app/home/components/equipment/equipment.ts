import { Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sensor } from '../../sensor';

@Component({
  selector: 'app-sensor-equipment',
  imports: [FormsModule],
  templateUrl: './equipment.html',
  styleUrls: ['../../home-shared.css', './equipment.css'],
  styles: [':host { display: contents; }'],
})
export class SensorEquipment {
  readonly categories = input.required<string[]>();
  readonly sensors = input.required<Sensor[]>();
  readonly query = model('');
  readonly category = model('All');
  readonly addRequested = output<void>();
  readonly sensorSelected = output<Sensor>();
  protected icon(name: string): string {
    if (name.includes('Temperature')) return 'M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0ZM12 9v9';
    if (name.includes('Wind')) return 'M3 8h13a3 3 0 1 0-3-3M3 12h17M3 16h11a3 3 0 1 1-3 3';
    if (name.includes('Pressure')) return 'M4 16a9 9 0 1 1 16 0H4ZM12 13l4-5M12 18v3M8 21h8';
    return 'M12 3S5 11 5 15a7 7 0 0 0 14 0c0-4-7-12-7-12ZM9 15a3 3 0 0 0 3 3';
  }
}
