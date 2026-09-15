import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ProductService } from '../../core/services/product';
import { Product } from '../../models/product';

@Component({
  selector: 'app-admin',
  imports: [FormsModule, RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {

  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  products: Product[] = [];

  loading = true;

  errorMessage = '';

  successMessage = '';

  showForm = false;

  editingId: number | null = null;

  form: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: '',
    stock: 0
  };

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {

    this.loading = true;

    this.productService.getProducts().subscribe({

      next: (products) => {

        this.products = products;

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

  openAddForm(): void {

    this.editingId = null;

    this.form = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      category: '',
      stock: 0
    };

    this.successMessage = '';
    this.errorMessage = '';

    this.showForm = true;
  }

  openEditForm(product: Product): void {

    this.editingId = product.id;

    this.form = {
      ...product
    };

    this.successMessage = '';
    this.errorMessage = '';

    this.showForm = true;
  }

  cancelForm(): void {

    this.showForm = false;

    this.editingId = null;
  }

  saveProduct(): void {

    this.successMessage = '';
    this.errorMessage = '';

    if (!this.form.name.trim()) {
      this.errorMessage = 'Product name is required.';
      return;
    }

    if (this.form.price <= 0) {
      this.errorMessage = 'Price must be greater than 0.';
      return;
    }

    if (this.form.stock < 0) {
      this.errorMessage = 'Stock cannot be negative.';
      return;
    }

    if (this.editingId === null) {

      this.productService
        .createProduct(this.form)
        .subscribe({

          next: () => {

            this.successMessage =
              'Product added successfully.';

            this.showForm = false;

            this.loadProducts();
          },

          error: (error) => {

            console.error(error);

            this.errorMessage =
              'Unable to add product.';
          }

        });

    } else {

      this.productService
        .updateProduct(
          this.editingId,
          this.form
        )
        .subscribe({

          next: () => {

            this.successMessage =
              'Product updated successfully.';

            this.showForm = false;

            this.loadProducts();
          },

          error: (error) => {

            console.error(error);

            this.errorMessage =
              'Unable to update product.';
          }

        });
    }
  }

  deleteProduct(product: Product): void {

    const confirmed =
      confirm(
        `Delete "${product.name}"?`
      );

    if (!confirmed) {
      return;
    }

    this.productService
      .deleteProduct(product.id)
      .subscribe({

        next: () => {

          this.successMessage =
            'Product deleted successfully.';

          this.loadProducts();
        },

        error: (error) => {

          console.error(error);

          this.errorMessage =
            'Unable to delete product.';
        }

      });
  }
}