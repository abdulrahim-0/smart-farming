import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter, Router } from '@angular/router';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should open Home after submitting login', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Admin Login,');
    compiled.querySelector<HTMLInputElement>('input[name="email"]')!.value = 'admin@example.com';
    compiled.querySelector<HTMLInputElement>('input[name="password"]')!.value = 'password';
    compiled.querySelector<HTMLFormElement>('form')!.requestSubmit();
    await fixture.whenStable();
    expect(router.url).toBe('/home');
    expect(compiled.querySelector('h1')?.textContent).toBe('IoT Sensors');
    expect(compiled.querySelector('form')).toBeNull();
    expect(compiled.querySelector('[aria-current="page"]')?.textContent).toContain('IoT Sensors');
    const disabledNavigation = compiled.querySelectorAll('nav button:disabled');
    expect(disabledNavigation.length).toBe(2);
    expect(disabledNavigation[0].textContent).toContain('Dashboard');
    expect(disabledNavigation[1].textContent).toContain('Environment Monitoring');
    expect(compiled.querySelectorAll('.sensor-card').length).toBe(27);
    const search = compiled.querySelector<HTMLInputElement>('input[type="search"]')!;
    search.value = 'AU28607';
    search.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(compiled.querySelectorAll('.sensor-card').length).toBe(1);
    expect(compiled.querySelector('.sensor-card')?.textContent).toContain('Inactive');
  });
});
