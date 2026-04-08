import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BoardService } from '../../core/services/board.service';

@Component({
  selector: 'app-board-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, FormsModule],
  templateUrl: './board-detail.html',
  styleUrl: './board-detail.scss' // Make sure this says styleUrl!
})
export class BoardDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private boardService = inject(BoardService);
  private cdr = inject(ChangeDetectorRef);
  board: any;

  // State for creating new lists/tasks
  isAddingList = false;
  newListTitle = '';
  addingTaskToListId: string | null = null;
  newTaskTitle = '';
  ngOnInit() {
    this.loadBoard();
  }

  loadBoard() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.boardService.getBoardById(id).subscribe({
        next: (data) => {
           this.board = data;
           this.cdr.detectChanges(); // Trigger change detection to update the UI
           },
        error: (err) => console.error('Error fetching board', err)
      });
    }
  }

  // --- Add List Logic ---
  saveList() {
    if (!this.newListTitle.trim()) {
      this.isAddingList = false;
      return;
    }
    this.boardService.createList(this.board.id, this.newListTitle).subscribe({
      next: () => {
        this.newListTitle = '';
        this.isAddingList = false;
        this.loadBoard(); // Refresh the board to show the new list
      }
    });
  }

  // --- Add Task Logic ---
  saveTask(listId: string) {
    if (!this.newTaskTitle.trim()) {
      this.addingTaskToListId = null;
      return;
    }
    this.boardService.createTask(listId, this.newTaskTitle).subscribe({
      next: () => {
        this.newTaskTitle = '';
        this.addingTaskToListId = null;
        this.loadBoard(); // Refresh the board to show the new task
      }
    });
  }

  // This function is triggered the moment you let go of the mouse click
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      // Reordering a task within the SAME list
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Moving a task to a DIFFERENT list
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    // Note: In a full app, you would also call an HTTP service here to save the new order to NestJS!
  }
}