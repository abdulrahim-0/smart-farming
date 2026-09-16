import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly passwordVisible = signal(false);
  protected readonly message = signal('');

  protected togglePasswordVisibility(): void {
    this.passwordVisible.update((visible) => !visible);
  }

  protected clearMessage(): void {
    this.message.set('');
  }

  protected login(event: Event): void {
    event.preventDefault();
    this.message.set('Login is not available yet. Please contact your administrator for access.');
  }

  protected recoverPassword(): void {
    this.message.set('Please contact your administrator to reset your password.');
  }
}
