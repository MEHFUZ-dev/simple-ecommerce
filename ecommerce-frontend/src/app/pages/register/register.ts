import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  email = '';
  password = '';

  errorMessage = '';

  register(): void {

  this.errorMessage = '';

  this.authService.register({
    username: this.username,
    email: this.email,
    password: this.password
  }).subscribe({
    next: () => {
      this.router.navigate(['/products']);
    },
    error: (error) => {
      this.errorMessage =
        error.error || 'Registration failed';
    }
  });
}
}