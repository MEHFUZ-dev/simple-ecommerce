import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private authService = inject(AuthService);
  private router = inject(Router);
  private cartService = inject(CartService);

  username = '';
  password = '';

  errorMessage = '';

  login(): void {

    this.errorMessage = '';

    this.authService.login({
      username: this.username,
      password: this.password
    }).subscribe({
      next: () => {
  this.cartService.refreshCartCount();

  if (this.authService.getRole() === 'ADMIN') {
    this.router.navigate(['/products']);
  } else {
    this.router.navigate(['/products']);
  }next: () => {
  this.cartService.refreshCartCount();

  if (this.authService.getRole() === 'ADMIN') {
    this.router.navigate(['/products']);
  } else {
    this.router.navigate(['/products']);
  }
}
},
      error: () => {
        this.errorMessage = 'Invalid username or password';
      }
    });
  }
}