import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order';
import { Order } from '../../models/order';
import { DatePipe } from '@angular/common';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-orders',
  imports: [RouterLink, DatePipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {

  private orderService = inject(OrderService);
  private changeDetector = inject(ChangeDetectorRef);

  orders: Order[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {

    console.log('Loading orders...');

    this.orderService.getOrders()
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetector.markForCheck();
        })
      )
      .subscribe({

      next: (data) => {
        console.log('Orders response:', data);

        this.orders = data;
      },

      error: (error) => {
        console.error('Orders error:', error);
      }

      });
  }
}