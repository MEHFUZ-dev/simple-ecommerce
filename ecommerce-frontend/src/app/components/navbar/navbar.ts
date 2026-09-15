import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { Router, RouterLink } from '@angular/router';

import { CartService } from '../../core/services/cart';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.cartService.refreshCartCount();
    }
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get username(): string {
    return this.authService.getUsername() || '';
  }

  get cartCount(): number {
    return this.cartService.cartCount();
  }

  get isAdmin(): boolean {
    return this.authService.getRole() === 'ADMIN';
  }

  logout(): void {
    this.authService.logout();

    // Reset cart
    this.cartService.cartCount.set(0);

    // Go to products page
    this.router.navigate(['/products']);

    // Force navbar to update immediately
    this.cdr.detectChanges();
  }
}