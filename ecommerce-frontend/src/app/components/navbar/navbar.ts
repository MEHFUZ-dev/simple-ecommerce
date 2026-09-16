import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { CartService } from '../../core/services/cart';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);

  // 🔽 Used by the mobile hamburger menu
  mobileOpen = false;

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.cartService.refreshCartCount();
    }
  }

  // ---------- Getters ----------
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

  // ---------- Actions ----------
  toggleMobile(): void {
    this.mobileOpen = !this.mobileOpen;
  }

  closeMobile(): void {
    this.mobileOpen = false;
  }

  logout(): void {
    this.authService.logout();

    // Reset cart count
    this.cartService.cartCount.set(0);

    // Close mobile menu if open
    this.mobileOpen = false;

    // Navigate to products
    this.router.navigate(['/products']);

    // Force navbar to update immediately
    this.cdr.detectChanges();
  }
}