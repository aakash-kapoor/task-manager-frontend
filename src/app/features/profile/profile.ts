import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NavBarComponent } from '../../shared/nav-bar/nav-bar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, NavBarComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  // Start with null while the API fetches the data
  user: any = null;

 ngOnInit() {
    this.authService.getProfile().subscribe({
      next: (response) => {
        // 1. Extract the nested user object from the API response
        this.user = response.user;
        
        // 2. Safely generate initials (Handles both "Aakash Kapoor" and "Aakash")
        if (this.user && this.user.name) {
          const names = this.user.name.trim().split(' ');
          if (names.length >= 2) {
            this.user.initials = (names[0][0] + names[names.length - 1][0]).toUpperCase();
          } else {
            // If just one name, take the first two letters
            this.user.initials = this.user.name.substring(0, 2).toUpperCase();
          }
        } else {
          this.user.initials = 'U';
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load profile', err)
    });
  }

  logout() {
    this.authService.logout();
  }
}