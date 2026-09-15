import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { OrderService } from '../../core/services/order';

@Component({
  selector: 'app-order-details',
  imports: [RouterLink, DatePipe],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css'
})
export class OrderDetails implements OnInit {

  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);

  order: any = null;
  items: any[] = [];

  loading = true;
  errorMessage = '';

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.orderService.getOrderById(id).subscribe({

      next: (data) => {

        this.order = data.order;
        this.items = data.items;

        this.loading = false;
        this.cdr.markForCheck();
      },

      error: (error) => {

        console.error(error);

        this.errorMessage =
          'Unable to load order.';

        this.loading = false;
        this.cdr.markForCheck();
      }

    });
  }

  getStatusText(status: string): string {

  switch (status) {

    case 'PLACED':
      return 'Order Placed';

    case 'PROCESSING':
      return 'Processing';

    case 'SHIPPED':
      return 'Shipped';

    case 'DELIVERED':
      return 'Delivered';

    case 'CANCELLED':
      return 'Cancelled';

    default:
      return status;

  }
}
}