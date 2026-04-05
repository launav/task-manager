import { TaskService } from './../../core/services/tasks.service';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Task } from '../../models/model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-tasks',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  standalone: true,
})
export class TasksComponent implements OnInit {

  private taskService = inject(TaskService);
  private destroyRef = inject(DestroyRef);

  editingTaskId = signal<string | null>(null);

  tasks: Task[] = [];

  taskForm: any;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.taskForm = this.fb.nonNullable.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(250)]],
      completed: [false],
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          console.log('Cargando tareas desde el servicio...', this.tasks);
        },
        error: () => {
          this.snackBar.open('Error al cargar las tareas', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-error'],
          });
        }
      })
  }

  submitForm(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const formValue = this.taskForm.getRawValue();

    if (this.editingTaskId()) {
      this.tasks = this.tasks.map((task) =>
        task._id === this.editingTaskId()
          ? {
            ...task,
            title: formValue.title,
            description: formValue.description,
            completed: formValue.completed,
          }
          : task
      );

      this.snackBar.open('Tarea actualizada correctamente', 'Cerrar', {
        duration: 2500,
      });
    } else {
      const newTask: Task = {
        _id: crypto.randomUUID(),
        title: formValue.title,
        description: formValue.description,
        completed: formValue.completed,
        createdAt: new Date().toISOString(),
      };

      this.tasks = [newTask, ...this.tasks];

      this.snackBar.open('Tarea añadida correctamente', 'Cerrar', {
        duration: 2500,
      });
    }

    this.resetForm();
  }

  editTask(task: Task): void {
    this.editingTaskId.set(task._id ?? null);

    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      completed: task.completed,
    });
  }

  deleteTask(taskId?: string): void {
    if (!taskId) return;

    this.taskService
      .deleteTask(taskId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadTasks();

          this.snackBar.open('Tarea eliminada correctamente', 'Cerrar', {
            duration: 2500,
            panelClass: ['snackbar-success'],
          });
        },
        error: () => {
          this.snackBar.open('Error al eliminar la tarea', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-error'],
          });
        },
      });
  }

  toggleCompleted(task: Task): void {
    if (!task._id) return;

    this.tasks = this.tasks.map((item) =>
      item._id === task._id
        ? { ...item, completed: !item.completed }
        : item
    );
  }

  resetForm(): void {
    this.taskForm.reset({
      title: '',
      description: '',
      completed: false,
    });

    this.editingTaskId.set(null);
  }

  trackByTaskId(index: number, task: Task): string {
    return task._id ?? index.toString();
  }


}
