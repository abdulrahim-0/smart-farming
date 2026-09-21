import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
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
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const credentials = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };
    
    this.http.post('http://51.222.143.153:5065/users/login', credentials).subscribe({
      next: (response: any) => {
        console.log('Login successful:', response);
        this.router.navigateByUrl('/home');
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.message.set('Invalid email or password. Please try again.');
      }
    });
  }

  protected navigateToHome(): void {
    void this.router.navigateByUrl('/home');
  }

  protected recoverPassword(): void {
    this.message.set('Please contact your administrator to reset your password.');
  }
}
