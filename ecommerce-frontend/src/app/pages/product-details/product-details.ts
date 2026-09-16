import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ProductService } from '../../core/services/product';
import { CartService } from '../../core/services/cart';
import { Product } from '../../models/product';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-product-details',
  imports: [RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  private productService = inject(ProductService);
  private cartService = inject(CartService);

  private cdr = inject(ChangeDetectorRef);

  private readonly localPlaceholderImage =
    '/product-placeholder.svg';

  product: Product | null = null;

  quantity = 1;

  loading = true;

  errorMessage = '';

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.productService.getProductById(id).subscribe({

      next: (product) => {

        this.product = {
          ...product,

          imageUrl:
            product.imageUrl ===
              'https://via.placeholder.com/300'
              ? this.localPlaceholderImage
              : product.imageUrl
        };

        this.loading = false;

        this.cdr.markForCheck();
      },

      error: (error) => {

        console.error(error);

        this.errorMessage =
          'Product not found.';

        this.loading = false;

        this.cdr.markForCheck();
      }

    });
  }

  increaseQuantity(): void {

    if (
      this.product &&
      this.quantity < this.product.stock
    ) {
      this.quantity++;
    }

  }

  decreaseQuantity(): void {

    if (this.quantity > 1) {
      this.quantity--;
    }

  }

  addToCart(): void {

    if (!this.product) {
      return;
    }

    if (!this.authService.isLoggedIn()) {
      alert('Please login to add products to cart.');
      this.router.navigate(['/login']);
      return;
    }

    if (this.product.stock <= 0) {
      alert('Product is out of stock.');
      return;
    }

    if (this.quantity > this.product.stock) {
      alert(`Only ${this.product.stock} item(s) available.`);
      this.quantity = this.product.stock;
      return;
    }

    this.cartService
      .addToCart(this.product.id, this.quantity)
      .subscribe({

        next: () => {
          alert(
            `${this.quantity} × ${this.product!.name} added to cart!`
          );

          // Reset quantity after adding
          this.quantity = 1;
        },

        error: (error) => {

          console.error(
            'Error adding product to cart:',
            error
          );

          if (error.status === 401 || error.status === 403) {

            alert('Please login to continue.');

            this.authService.logout();

            this.router.navigate(['/login']);

            return;
          }

          alert(
            error.error?.message ||
            'Unable to add product to cart.'
          );
        }

      });
  }

  onImageError(event: Event): void {

    const image =
      event.target as HTMLImageElement;

    image.src =
      this.localPlaceholderImage;
  }
}