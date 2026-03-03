import { Component, input, output } from '@angular/core';

interface Task {
  id: number;
  description: string;
  isCompleted: boolean;
}

@Component({
  standalone: true,
  selector: 'app-task-item',  
  templateUrl: './task-item.html',
  styleUrls: ['./task-item.css'],
})
export class TaskItem {
  taskData = input.required<Task>();

  onRemove = output<number>();
  onToggle = output<void>();

  handleRemove():void{
    this.onRemove.emit(this.taskData().id);
  }

  handleToggle():void{
    this.onToggle.emit();
  }

}
