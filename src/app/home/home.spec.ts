import { vi } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Home } from './home';

describe('Home interactions', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', { getItem: () => null });
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
    vi.unstubAllGlobals();
  });

  function respondWithSensors() {
    TestBed.inject(HttpTestingController).expectOne(
      (request) => request.url.includes('/sensors/list'),
    ).flush({
      success: true,
      data: [
        { sensorID: '24854', IMEI: null, name: 'DL-TRS12 LORAWAN', categorymetricsID: 1, isOn: false, status: '1' },
        { sensorID: '24803', IMEI: '12345', name: 'DL-SHT35 LORAWAN', categorymetricsID: 2, isOn: true, status: '1' },
      ],
    });
  }

  it('filters sensors and opens and closes sensor details', async () => {
    const fixture = TestBed.createComponent(Home);
    respondWithSensors();
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelectorAll('.sensor-card').length).toBe(2);

    page.querySelector<HTMLButtonElement>('.soil-tab')!.click();
    await fixture.whenStable();
    expect(page.querySelectorAll('.sensor-card').length).toBe(1);

    const search = page.querySelector<HTMLInputElement>('input[type="search"]')!;
    search.value = ' 24854 ';
    search.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(page.querySelectorAll('.sensor-card').length).toBe(1);
    page.querySelector<HTMLButtonElement>('.sensor-card')!.click();
    await fixture.whenStable();
    expect(page.querySelector('[role="dialog"]')?.textContent).toContain('24854');
    expect(page.querySelector('[role="dialog"]')?.textContent).toContain('Inactive');
    page.querySelector<HTMLButtonElement>('.close')!.click();
    await fixture.whenStable();
    expect(page.querySelector('[role="dialog"]')).toBeNull();

    search.value = 'missing sensor';
    search.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(page.querySelector('.empty')?.textContent).toContain('No sensors match');
  });

  it('adds a sensor and resets filters through the dialog', async () => {
    const fixture = TestBed.createComponent(Home);
    respondWithSensors();
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;
    page.querySelector<HTMLButtonElement>('.soil-tab')!.click();
    const search = page.querySelector<HTMLInputElement>('input[type="search"]')!;
    search.value = 'missing sensor';
    search.dispatchEvent(new Event('input'));
    page.querySelector<HTMLButtonElement>('.toolbar .add-button')!.click();
    await fixture.whenStable();
    const form = page.querySelector<HTMLFormElement>('form')!;
    for (const [name, value] of Object.entries({
      name: 'New weather sensor',
      id: 'NEW001',
      imei: '123456789012345',
      category: 'Weather Monitoring Sensors',
    })) {
      form.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${name}"]`)!.value = value;
    }
    form.requestSubmit();
    await fixture.whenStable();
    expect(page.querySelector('[role="dialog"]')).toBeNull();
    expect(page.querySelectorAll('.sensor-card').length).toBe(3);
    expect(search.value).toBe('');
    expect(page.querySelector('.tabs .current')?.textContent?.trim()).toBe('All');
    expect(page.querySelector('.sensor-grid')?.textContent).toContain('New weather sensor');
  });
});
