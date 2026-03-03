import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { TaskItem } from "./components/task-item/task-item";


interface Task {
  id: number;
  description: string;
  isCompleted: boolean;
}


@Component({
  standalone: true,
  selector: 'app-root',  
  imports: [FormsModule, TaskItem],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit {

  protected http = inject(HttpClient);

  newTaskDescription = signal<string>('');

  taskList = signal<Task[]>([]);

  constructor() {
    effect(() => {
      if (this.taskList().length > 0) {
        localStorage.setItem('tasks', JSON.stringify(this.taskList()));
        console.log('Sincronizado com LocalStorage');
      }
    });
  }

  ngOnInit(): void {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      this.taskList.set(JSON.parse(savedTasks));
    } else {
      this.http.get<Task[]>('tasks.json').subscribe({
        next: (response) => {
          this.taskList.set(response);
          console.log('Ddos Lidos:', response)
        },

        error: (err) => console.error("Erro ao ler arquivo.", err)
      });
    }
  }


  addTask(): void {
    const description = this.newTaskDescription();
    if (description.trim()) {
      const currentTasks = this.taskList();
      const nextId = currentTasks.length > 0
        ? Math.max(...currentTasks.map(t => t.id)) + 1
        : 1;
      const newTask: Task = {
        id: nextId,
        description: description,
        isCompleted: false,
      };

      this.taskList.update(tasks => [...tasks, newTask]);
      this.newTaskDescription.set('');
    }
  }

  deleteTask(_id: number): void {
    this.taskList.update(tasks => tasks.filter(t => t.id !== _id));
  }

  toggleTaskStatus(taskUpdate: Task): void {
    this.taskList.update(tasks =>
      tasks.map(t =>
        t.id === taskUpdate.id ? { ...t, isCompleted: !t.isCompleted } : t))
  }

}
