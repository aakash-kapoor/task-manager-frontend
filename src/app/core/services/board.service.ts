import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/boards`;

  // Fetch all boards for the logged-in user
  getBoards() {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Create a new board
  createBoard(title: string) {
    return this.http.post<any>(this.apiUrl, { title });
  }

  // Fetch a single board with all its lists and tasks (for the next step!)
  getBoardById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Create a new list inside a specific board
  createList(boardId: string, title: string) {
    // Adjust this URL if your NestJS route is different (e.g., /lists)
    return this.http.post<any>(`${environment.apiUrl}/lists`, { boardId, title });
  }

  // Create a new task inside a specific list
  createTask(listId: string, title: string) {
    // Adjust this URL if your NestJS route is different (e.g., /tasks)
    return this.http.post<any>(`http://localhost:3000/lists/${listId}/tasks`, { title });
  }
}