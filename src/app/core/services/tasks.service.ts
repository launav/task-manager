import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Task } from '../../models/model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/tasks';

  // Obtener tasks
  getTasks(): Observable<Task[]> {
    // return this.http.get<Task[]>(this.apiUrl);
    const mockTasks: Task[] = [
      {
        _id: '1',
        title: 'Preparar estructura del proyecto',
        description: 'Montar frontend con Angular y Material',
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        _id: '2',
        title: 'Diseñar interfaz',
        description: 'Crear formulario y listado de tareas',
        completed: true,
        createdAt: new Date().toISOString(),
      },
    ];
    return of(mockTasks);
  }

  // Crear task
  createTask(task: Omit<Task, '_id' | 'createdAt'>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  // Actualizar task
  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  // Eliminar task
  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
