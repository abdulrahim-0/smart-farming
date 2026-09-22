import { DecimalPipe } from '@angular/common';
import { SensorSummary } from '../../sensor';
import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  effect,
  signal,
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
  imports: [DecimalPipe],
  templateUrl: './overview.html',
  styleUrls: ['../../home-shared.css', './overview.css'],
  styles: [':host { display: contents; }'],
})
export class SensorOverview {
  readonly summary = input.required<SensorSummary>();
  private readonly chart = signal<ReturnType<typeof init> | null>(null);
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
      this.chart.set(chart);
      this.destroyRef.onDestroy(() => chart.dispose());
    });
    effect(() => {
      const summary = this.summary();
      this.chart()?.setOption({
        series: [
          {
            type: 'pie',
            radius: ['60%', '95%'],
            stillShowZeroSum: false,
            label: { show: false },
            labelLine: { show: false },
            emphasis: { scale: false, label: { show: false } },
            data: [
              { value: summary.active, name: 'Active', itemStyle: { color: '#4fb063' } },
              { value: summary.inactive, name: 'Inactive', itemStyle: { color: '#3f4640' } },
            ],
          },
        ],
      });
    });
  }
}
