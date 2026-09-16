import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { ActivatedRoute, RouterLink } from '@angular/router';

import { ProductService } from '../../core/services/product';
import { CartService } from '../../core/services/cart';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { Product } from '../../models/product';

@Component({
  selector: 'app-products',
  imports: [RouterLink, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {

  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
private authService = inject(AuthService);
  private readonly localPlaceholderImage =
    '/product-placeholder.svg';

  products: Product[] = [];

  filteredProducts: Product[] = [];

  categories: string[] = [];

  searchText = '';

  selectedCategory = 'All';

  sortOption = 'default';

  loading = true;

  errorMessage = '';

  ngOnInit(): void {

    this.route.queryParamMap.subscribe(params => {

      this.selectedCategory =
        params.get('category') || 'All';

      this.applyFilters();

    });

    this.loadProducts();

  }

  loadProducts(): void {

    this.loading = true;
    this.errorMessage = '';

    this.productService.getProducts().subscribe({

      next: (data) => {

        this.products = data.map(product => ({

          ...product,

          imageUrl:
            product.imageUrl ===
            'https://via.placeholder.com/300'
              ? this.localPlaceholderImage
              : product.imageUrl

        }));

        this.categories = [
          'All',
          ...new Set(
            this.products
              .map(product => product.category)
              .filter(category => !!category)
          )
        ];

        this.applyFilters();

        this.loading = false;

        this.cdr.markForCheck();
      },

      error: (error) => {

        console.error(
          'Error loading products:',
          error
        );

        this.errorMessage =
          'Unable to load products. Please try again later.';

        this.loading = false;

        this.cdr.markForCheck();
      }

    });
  }

  applyFilters(): void {

    let result = [...this.products];

    // Search
    const search = this.searchText
      .trim()
      .toLowerCase();

    if (search) {

      result = result.filter(product =>
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search)
      );

    }

    // Category
    if (this.selectedCategory !== 'All') {

      result = result.filter(
        product =>
          product.category === this.selectedCategory
      );

    }

    // Sorting
    if (this.sortOption === 'price-low') {

      result.sort(
        (a, b) => a.price - b.price
      );

    } else if (this.sortOption === 'price-high') {

      result.sort(
        (a, b) => b.price - a.price
      );

    } else if (this.sortOption === 'name') {

      result.sort(
        (a, b) =>
          a.name.localeCompare(b.name)
      );

    }

    this.filteredProducts = result;

    this.cdr.markForCheck();
  }

  onSearch(): void {

    this.applyFilters();

  }

  onCategoryChange(): void {

    this.applyFilters();

  }

  onSortChange(): void {

    this.applyFilters();

  }

  clearFilters(): void {

    this.searchText = '';

    this.selectedCategory = 'All';

    this.sortOption = 'default';

    this.applyFilters();

  }

  addToCart(product: Product): void {

  if (!this.authService.isLoggedIn()) {

    alert('Please login to add products to cart.');

    this.router.navigate(['/login']);

    return;
  }

  if (product.stock <= 0) {

    alert('Product is out of stock.');

    return;
  }

  this.cartService
    .addToCart(product.id, 1)
    .subscribe({

      next: () => {

        alert(`${product.name} added to cart!`);

      },

      error: (error) => {

        console.error(
          'Error adding product to cart:',
          error
        );

        if (
          error.status === 401 ||
          error.status === 403
        ) {

          this.authService.logout();

          alert('Please login to continue.');

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