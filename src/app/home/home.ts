import { Component, computed, signal, inject} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  http = inject(HttpClient);
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
  });
  constructor() {
    this.http.get('http://51.222.143.153:5065/sensors/list?metricsID=All&parkID=2&row=9&page=1&categorymetricsID=1&categorymetricsID=2&search=&fullData=true', { headers: this.headers }).subscribe({
    next: (response: any) => {
      this.sensors.set(response.data.map((sensor: {
        sensorID: string;
        IMEI: string | null;
        name: string;
        categorymetricsID: number;
        isOn: boolean;
      }) => ({
        id: sensor.sensorID,
        imei: sensor.IMEI ?? '',
        name: sensor.name,
        category: sensor.categorymetricsID === 1 ? 'Soil Data Sensors' : 'Weather Monitoring Sensors',
        active: sensor.isOn,
      })));
    },
    error: (error) => {
      console.error('Failed to fetch sensors:', error);
    }
  });
  }
  protected readonly query = signal('');
  protected readonly category = signal('All');
  protected readonly status = signal('All');
  protected readonly adding = signal(false);
  protected readonly selected = signal<Sensor | null>(null);
  protected readonly categories = ['All', 'Soil Data Sensors', 'Weather Monitoring Sensors'];
  protected readonly sensors = signal<Sensor[]>([]);
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
