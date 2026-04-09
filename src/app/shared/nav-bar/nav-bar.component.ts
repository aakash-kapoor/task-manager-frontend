import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LucideAngularModule, Kanban, User, LogOut } from 'lucide-angular';
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  readonly KanbanIcon = Kanban;
  readonly UserIcon = User;
  readonly LogOutIcon = LogOut;
  currentPage = input<'dashboard' | 'profile' | 'board'>('dashboard');

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
