import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BoardService } from '../../core/services/board.service';
import { LucideAngularModule, Plus, X, FileText, LayoutPanelLeft } from 'lucide-angular';
import { NavBarComponent } from '../../shared/nav-bar/nav-bar.component';
@Component({
  selector: 'app-board-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, FormsModule, LucideAngularModule, NavBarComponent],
  templateUrl: './board-detail.html',
  styleUrl: './board-detail.scss' // Make sure this says styleUrl!
})
export class BoardDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private boardService = inject(BoardService);
  private cdr = inject(ChangeDetectorRef);
  readonly PlusIcon = Plus;
  readonly CloseIcon = X;
  readonly FileTextIcon = FileText;
  readonly CardIcon = LayoutPanelLeft;
  board: any;
  selectedTask: any = null;
  // State for creating new lists/tasks
  isAddingList = false;
  newListTitle = '';
  addingTaskToListId: string | null = null;
  newTaskTitle = '';

  selectedListName: string = '';
  isEditingTitle = false;
  isEditingDescription = false;
  editTaskTitle = '';
  editTaskDescription = '';
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
 drop(event: CdkDragDrop<any[]>, targetList: any) {
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
      // Grab the specific task we just dropped
      const movedTask = event.container.data[event.currentIndex];

      // 3. Send the update to the NestJS Backend!
      this.boardService.moveTask(movedTask.id, targetList.id, targetList.order).subscribe({
        next: () => console.log('Task successfully moved in database!'),
        error: (err) => {
          console.error('Failed to move task', err);
          // Optional: If the API fails, you could move the card back to its original list here to keep the UI in sync
        }
      });
    }
  }

  openTask(task: any, listName: string) {
    this.selectedTask = task;
    this.selectedListName = listName;
    this.editTaskTitle = task.title;
    this.editTaskDescription = task.description || ''; // Fallback to empty string if null
    this.isEditingTitle = false; // Reset the title toggle
    this.isEditingDescription = false;
  }

  saveTaskDetails() {
    const payload = {
      title: this.editTaskTitle,
      description: this.editTaskDescription
    };

    this.boardService.updateTask(this.selectedTask.id, payload).subscribe({
      next: (updatedTask) => {
        // Update the modal's view
        this.selectedTask.title = payload.title;
        this.selectedTask.description = payload.description;
        this.isEditingTitle = false;
        this.isEditingDescription = false;
        this.cdr.detectChanges(); // Update the modal with new details
        // Update the card on the actual board canvas so it doesn't revert on close
        const list = this.board.lists.find((l: any) => l.title === this.selectedListName);
        if (list) {
          const taskIndex = list.tasks.findIndex((t: any) => t.id === this.selectedTask.id);
          if (taskIndex > -1) {
            list.tasks[taskIndex].title = payload.title;
            list.tasks[taskIndex].description = payload.description;
          }
        }
      },
      error: (err) => console.error('Failed to save task details', err)
    });
  }

  closeModal() {
    this.selectedTask = null;
    this.selectedListName = '';
  }

  cancelEdit() {
    this.isEditingTitle = false;
    this.isEditingDescription = false;
    this.editTaskTitle = this.selectedTask?.title || '';
    this.editTaskDescription = this.selectedTask?.description || '';
  }
}