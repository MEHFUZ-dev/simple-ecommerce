import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  profile: any = null;

  loading = true;
  errorMessage = '';

  ngOnInit(): void {

    this.authService.getProfile().subscribe({

      next: (data) => {

        this.profile = data;

        this.loading = false;

        this.cdr.markForCheck();
      },

      error: (error) => {

        console.error('Profile error:', error);

        this.errorMessage =
          'Unable to load profile.';

        this.loading = false;

        this.cdr.markForCheck();
      }

    });
  }
}