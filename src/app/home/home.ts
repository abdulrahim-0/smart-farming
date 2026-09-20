import { afterNextRender, Component, computed, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PieChart } from 'echarts/charts';
import { init, use } from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';

use([PieChart, SVGRenderer]);

@Component({
  selector: 'app-home',
  imports: [FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly sensorChart = viewChild.required<ElementRef<HTMLDivElement>>('sensorChart');
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const chart = init(this.sensorChart().nativeElement, undefined, {
        renderer: 'svg',
        width: 89,
        height: 89,
      });
      chart.setOption({
        series: [{
          type: 'pie',
          radius: ['60%', '95%'],
          label: { show: false },
          labelLine: { show: false },
          emphasis: { scale: false, label: { show: false } },
          data: [
            { value: 4592, name: 'Active', itemStyle: { color: '#4fb063' } },
            { value: 240, name: 'Inactive', itemStyle: { color: '#3f4640' } },
          ],
        }],
      });
      this.destroyRef.onDestroy(() => chart.dispose());
    });
  }

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
  protected icon(name: string): string {
    if (name.includes('Temperature')) return 'M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0ZM12 9v9';
    if (name.includes('Wind')) return 'M3 8h13a3 3 0 1 0-3-3M3 12h17M3 16h11a3 3 0 1 1-3 3';
    if (name.includes('Pressure')) return 'M4 16a9 9 0 1 1 16 0H4ZM12 13l4-5M12 18v3M8 21h8';
    return 'M12 3S5 11 5 15a7 7 0 0 0 14 0c0-4-7-12-7-12ZM9 15a3 3 0 0 0 3 3';
  }
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
interface Sensor {
  id: string;
  imei: string;
  name: string;
  category: string;
  active: boolean;
}
