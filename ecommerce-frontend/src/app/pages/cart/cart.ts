import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartService } from '../../core/services/cart';
import { ProductService } from '../../core/services/product';

import { CartItem } from '../../models/cart-item';
import { Product } from '../../models/product';

interface CartProduct {
  cartItem: CartItem;
  product: Product;
}

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {

  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  cartProducts: CartProduct[] = [];

  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {

    this.loading = true;
    this.errorMessage = '';

    this.cartService.getCart().subscribe({

      next: (items) => {

        if (items.length === 0) {
          this.cartProducts = [];
          this.loading = false;
          this.cdr.markForCheck();
          return;
        }

        let completed = 0;
        const result: CartProduct[] = [];

        items.forEach(item => {

          this.productService.getProductById(item.productId).subscribe({

            next: (product) => {

              result.push({
                cartItem: item,
                product: product
              });

              completed++;

              if (completed === items.length) {
                this.cartProducts = result;
                this.loading = false;
                this.cdr.markForCheck();
              }
            },

            error: (error) => {

              console.error('Error loading product:', error);

              completed++;

              if (completed === items.length) {
                this.cartProducts = result;
                this.loading = false;
                this.cdr.markForCheck();
              }
            }

          });

        });

      },

      error: (error) => {

        console.error('Cart error:', error);

        this.errorMessage =
          'Unable to load your cart. Please try again.';

        this.loading = false;
        this.cdr.markForCheck();
      }

    });
  }

  increaseQuantity(item: CartProduct): void {

    const newQuantity = item.cartItem.quantity + 1;

    if (newQuantity > item.product.stock) {
      return;
    }

    this.updateQuantity(item, newQuantity);
  }

  decreaseQuantity(item: CartProduct): void {

    const newQuantity = item.cartItem.quantity - 1;

    if (newQuantity < 1) {
      return;
    }

    this.updateQuantity(item, newQuantity);
  }

  updateQuantity(
    item: CartProduct,
    quantity: number
  ): void {

    this.cartService
      .updateQuantity(item.cartItem.id, quantity)
      .subscribe({

        next: () => {
          item.cartItem.quantity = quantity;
          this.cdr.markForCheck();
        },

        error: (error) => {
          console.error('Error updating cart:', error);
        }

      });
  }

  removeItem(item: CartProduct): void {

    this.cartService
      .removeFromCart(item.cartItem.id)
      .subscribe({

        next: () => {

          this.cartProducts =
            this.cartProducts.filter(
              i => i.cartItem.id !== item.cartItem.id
            );

          this.cdr.markForCheck();
        },

        error: (error) => {
          console.error('Error removing item:', error);
        }

      });
  }

  getSubtotal(item: CartProduct): number {

    return item.product.price *
           item.cartItem.quantity;
  }

  getTotal(): number {

    return this.cartProducts.reduce(
      (total, item) =>
        total + this.getSubtotal(item),
      0
    );
  }
}