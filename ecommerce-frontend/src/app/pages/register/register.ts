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

  const userData = {
    username: this.username,
    email: this.email,
    password: this.password
  };

  console.log('1. Registering user...');

  this.authService.register(userData).subscribe({

    next: (response) => {

      console.log('2. Registration successful:', response);
      console.log('3. Trying automatic login...');

      this.authService.login({
        username: this.username,
        password: this.password
      }).subscribe({

        next: (loginResponse) => {

          console.log('4. Automatic login successful:', loginResponse);
          console.log('5. Token:', localStorage.getItem('token'));

          this.router.navigate(['/products']);

        },

        error: (error) => {

          console.error('4. Automatic login FAILED:', error);

          this.errorMessage =
            'Registration successful, but automatic login failed';

        }

      });

    },

    error: (error) => {

      console.error('Registration FAILED:', error);

      this.errorMessage =
        error.error || 'Registration failed';

    }

  });
}
}