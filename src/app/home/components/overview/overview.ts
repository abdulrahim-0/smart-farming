import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { PieChart } from 'echarts/charts';
import { init, use } from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';

use([PieChart, SVGRenderer]);

@Component({
  selector: 'app-sensor-overview',
  imports: [],
  templateUrl: './overview.html',
  styleUrls: ['../../home-shared.css', './overview.css'],
  styles: [':host { display: contents; }'],
})
export class SensorOverview {
  readonly categories = input.required<string[]>();
  private readonly sensorChart = viewChild.required<ElementRef<HTMLDivElement>>('sensorChart');
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const chart = init(this.sensorChart().nativeElement, undefined, {
        renderer: 'svg',
        width: 117,
        height: 117,
      });
      chart.setOption({
        series: [
          {
            type: 'pie',
            radius: ['60%', '95%'],
            label: { show: false },
            labelLine: { show: false },
            emphasis: { scale: false, label: { show: false } },
            data: [
              { value: 4592, name: 'Active', itemStyle: { color: '#4fb063' } },
              { value: 240, name: 'Inactive', itemStyle: { color: '#3f4640' } },
            ],
          },
        ],
      });
      this.destroyRef.onDestroy(() => chart.dispose());
    });
  }
}
