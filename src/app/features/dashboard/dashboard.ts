import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BoardService } from '../../core/services/board.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  private boardService = inject(BoardService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  boards: any[] = [];
  newBoardTitle = '';

  ngOnInit() {
    this.loadBoards();
  }

  loadBoards() {
    this.boardService.getBoards().subscribe({
      next: (data) => {
        this.boards = data;
        this.cdr.detectChanges(); // Trigger change detection
      },
      error: (err) => console.error('Failed to load boards', err)
    });
  }

  createBoard() {
    if (!this.newBoardTitle.trim()) return;
    
    this.boardService.createBoard(this.newBoardTitle).subscribe({
      next: (newBoard) => {
        this.boards.push(newBoard); // Add it to the UI immediately
        console.log('this.boards :', this.boards);
        this.newBoardTitle = '';    // Clear the input
      },
      error: (err) => console.error('Failed to create board', err)
    });
  }

  logout() {
    this.authService.logout();
  }
}