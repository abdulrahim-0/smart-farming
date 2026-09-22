import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatPaginatorHarness } from '@angular/material/paginator/testing';
import { SensorEquipment } from './equipment';

describe('Sensor pagination', () => {
  it('pages cards, changes page size, and resets when filtered results change', async () => {
    const fixture = TestBed.createComponent(SensorEquipment);
    const sensors = Array.from({ length: 20 }, (_, index) => ({
      id: String(index),
      name: `Sensor ${index}`,
      imei: '',
      category: 'Soil Data Sensors',
      active: true,
    }));
    fixture.componentRef.setInput('categories', ['All']);
    fixture.componentRef.setInput('sensors', sensors);
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;
    const paginator =
      await TestbedHarnessEnvironment.loader(fixture).getHarness(MatPaginatorHarness);
    expect(page.querySelectorAll('.sensor-card')).toHaveLength(9);
    await paginator.goToNextPage();
    expect(page.querySelector('.sensor-card')?.textContent).toContain('Sensor 9');
    await paginator.goToLastPage();
    expect(page.querySelectorAll('.sensor-card')).toHaveLength(2);
    await paginator.setPageSize(18);
    await paginator.goToFirstPage();
    expect(page.querySelectorAll('.sensor-card')).toHaveLength(18);
    await paginator.goToNextPage();
    fixture.componentRef.setInput('sensors', sensors.slice(0, 1));
    await fixture.whenStable();
    expect(page.querySelectorAll('.sensor-card')).toHaveLength(1);
    expect(await paginator.getRangeLabel()).toBe('1 – 1 of 1');
    fixture.componentRef.setInput('sensors', []);
    await fixture.whenStable();
    expect(page.querySelector('.empty')?.textContent).toContain('No sensors match');
    expect(await paginator.isNextPageDisabled()).toBe(true);
  });
});
