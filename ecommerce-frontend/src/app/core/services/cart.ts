import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { CartItem } from '../../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/cart';

  cartCount = signal(0);

  getCart(): Observable<CartItem[]> {

    return this.http.get<CartItem[]>(this.apiUrl).pipe(

      tap(items => {

        const count = items.reduce(
          (total, item) => total + item.quantity,
          0
        );

        this.cartCount.set(count);
      })

    );
  }

  addToCart(
    productId: number,
    quantity: number
  ): Observable<CartItem> {

    return this.http.post<CartItem>(
      this.apiUrl,
      {
        productId,
        quantity
      }
    ).pipe(

      tap(() => {
        this.refreshCartCount();
      })

    );
  }

  updateQuantity(
    cartItemId: number,
    quantity: number
  ): Observable<CartItem> {

    return this.http.put<CartItem>(
      `${this.apiUrl}/${cartItemId}`,
      {
        quantity
      }
    ).pipe(

      tap(() => {
        this.refreshCartCount();
      })

    );
  }

  removeFromCart(
    cartItemId: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${cartItemId}`
    ).pipe(

      tap(() => {
        this.refreshCartCount();
      })

    );
  }

  refreshCartCount(): void {

    this.http.get<CartItem[]>(this.apiUrl).subscribe({

      next: (items) => {

        const count = items.reduce(
          (total, item) => total + item.quantity,
          0
        );

        this.cartCount.set(count);
      },

      error: (error) => {
        console.error('Cart count error:', error);
      }

    });
  }
}