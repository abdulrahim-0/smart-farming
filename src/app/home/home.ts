import { Component, computed, signal } from '@angular/core';
import { Sensor } from './sensor';
import { HomeSidebar } from './components/sidebar/sidebar';
import { HomeHeader } from './components/header/header';
import { SensorOverview } from './components/overview/overview';
import { SensorEquipment } from './components/equipment/equipment';
import { SensorDialog } from './components/dialog/dialog';

@Component({
  selector: 'app-home',
  imports: [HomeSidebar, HomeHeader, SensorOverview, SensorEquipment, SensorDialog],
  templateUrl: './home.html',
  styleUrls: ['./home-shared.css', './home.css'],
})
export class Home {
  protected readonly query = signal('');
  protected readonly category = signal('All');
  protected readonly status = signal('All');
  protected readonly adding = signal(false);
  protected readonly selected = signal<Sensor | null>(null);
  protected readonly categories = ['All', 'Soil Data Sensors', 'Weather Monitoring Sensors'];
  protected readonly sensors = signal<Sensor[]>(
    Array.from({ length: 27 }, (_, i) => ({
      id: `AU${28600 + i}`,
      imei: `8642000000${String(i + 1).padStart(5, '0')}`,
      name: [
        'BI - Temperature',
        'BI - Temperature',
        'BI - Humidity',
        'BI - Temperature',
        'BI - Moisture',
        'BI - Wind Speed',
        'BI - Temperature',
        'BI - Temperature',
        'BI - Humidity',
        'BI - Humidity',
        'BI - Pressure',
        'BI - Humidity',
        'BI - Temperature',
        'BI - Moisture',
        'BI - Wind Speed',
        'BI - Pressure',
        'BI - Temperature',
        'BI - Humidity',
        'BI - Rainfall',
        'BI - Moisture',
        'BI - Wind Speed',
        'BI - Temperature',
        'BI - Moisture',
        'BI - Wind Speed',
        'BI - Humidity',
        'BI - Pressure',
        'BI - Humidity',
      ][i],
      category: i % 3 === 0 || i % 3 === 1 ? 'Soil Data Sensors' : 'Weather Monitoring Sensors',
      active: ![7, 14, 23].includes(i),
    })),
  );
  protected readonly filtered = computed(() =>
    this.sensors().filter(
      (sensor) =>
        (this.category() === 'All' || sensor.category === this.category()) &&
        (this.status() === 'All' || sensor.active === (this.status() === 'Active')) &&
        `${sensor.name} ${sensor.id} ${sensor.imei}`
          .toLowerCase()
          .includes(this.query().toLowerCase().trim()),
    ),
  );
  protected add(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    this.sensors.update((sensors) => [
      ...sensors,
      {
        id: String(data.get('id')),
        name: String(data.get('name')),
        imei: String(data.get('imei')),
        category: String(data.get('category')),
        active: true,
      },
    ]);
    this.query.set('');
    this.category.set('All');
    this.status.set('All');
    this.adding.set(false);
  }
}
