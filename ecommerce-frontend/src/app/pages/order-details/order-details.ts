import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

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

  /**
   * Numeric rank for each status, used to compute progress.
   * Higher = further along the fulfillment journey.
   */
  private readonly stepOrder: Record<string, number> = {
    PLACED: 1,
    PROCESSING: 2,
    SHIPPED: 3,
    DELIVERED: 4,
  };

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

        this.errorMessage = 'Unable to load order.';

        this.loading = false;
        this.cdr.markForCheck();
      }

    });
  }

  // ---------- Status label ----------
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

  // ---------- Progress helpers ----------
  /**
   * True when this step is the CURRENT step of the order.
   * Example: order status is SHIPPED → isStepActive('SHIPPED') === true
   */
  isStepActive(step: string): boolean {
    return this.order?.status === step;
  }

  /**
   * True when this step has ALREADY been completed.
   * Example: order status is SHIPPED → isStepDone('PLACED') === true,
   *          isStepDone('PROCESSING') === true,
   *          isStepDone('DELIVERED') === false
   */
  isStepDone(step: string): boolean {
    const current = this.stepOrder[this.order?.status] ?? 0;
    const target = this.stepOrder[step] ?? 0;
    return current > target;
  }
}