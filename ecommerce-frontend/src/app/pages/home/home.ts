import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { RouterLink } from '@angular/router';

import { ProductService } from '../../core/services/product';
import { Product } from '../../models/product';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  products: Product[] = [];

  loading = true;

  errorMessage = '';

  ngOnInit(): void {

    this.productService.getProducts().subscribe({

      next: (products) => {

        this.products = products.map(product => ({
          ...product,
          imageUrl:
            product.imageUrl ===
              'https://via.placeholder.com/300'
              ? '/product-placeholder.svg'
              : product.imageUrl
        }));

        this.loading = false;

        this.cdr.markForCheck();
      },

      error: (error) => {

        console.error(error);

        this.errorMessage =
          'Unable to load products.';

        this.loading = false;

        this.cdr.markForCheck();
      }

    });
  }

  get featuredProducts(): Product[] {

    return this.products.slice(0, 4);

  }
}