import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { CartService } from '../../core/services/cart';
import { ProductService } from '../../core/services/product';
import { OrderService } from '../../core/services/order';

import { CartItem } from '../../models/cart-item';
import { Product } from '../../models/product';

interface CheckoutItem {
  cartItem: CartItem;
  product: Product;
}

@Component({
  selector: 'app-checkout',
  imports: [RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {

  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  items: CheckoutItem[] = [];

  loading = true;
  placingOrder = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {

    this.cartService.getCart().subscribe({

      next: (cartItems) => {

        if (cartItems.length === 0) {
          this.items = [];
          this.loading = false;
          this.cdr.markForCheck();
          return;
        }

        let completed = 0;
        const result: CheckoutItem[] = [];

        cartItems.forEach(cartItem => {

          this.productService
            .getProductById(cartItem.productId)
            .subscribe({

              next: (product) => {

                result.push({
                  cartItem,
                  product
                });

                completed++;

                if (completed === cartItems.length) {
                  this.items = result;
                  this.loading = false;
                  this.cdr.markForCheck();
                }

              },

              error: () => {

                completed++;

                if (completed === cartItems.length) {
                  this.items = result;
                  this.loading = false;
                  this.cdr.markForCheck();
                }

              }

            });

        });

      },

      error: (error) => {

        console.error(error);

        this.errorMessage =
          'Unable to load checkout.';

        this.loading = false;
        this.cdr.markForCheck();
      }

    });
  }

  getTotal(): number {

    return this.items.reduce(
      (total, item) =>
        total +
        item.product.price *
        item.cartItem.quantity,
      0
    );
  }

placeOrder(): void {

  if (this.items.length === 0) {
    return;
  }

  if (this.placingOrder) {
    return;
  }

  this.placingOrder = true;
  this.errorMessage = '';

  this.orderService.placeOrder().subscribe({

    next: (order) => {

      this.router.navigate([
        '/orders',
        order.id
      ]);

    },

    error: (error) => {

      console.error(
        'Order error:',
        error
      );

      this.errorMessage =
        error.error?.message ||
        'Unable to place order. Please try again.';

      this.placingOrder = false;

      this.cdr.markForCheck();
    }

  });
}
}