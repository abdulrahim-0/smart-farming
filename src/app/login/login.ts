import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly router = inject(Router);
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
    void this.router.navigateByUrl('/home');
  }

  protected recoverPassword(): void {
    this.message.set('Please contact your administrator to reset your password.');
  }
}
