import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environments';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';


interface Task {
  taskId: number;
  task: string;
  taskStatus: boolean;
}

interface Users {
  userId: number;
  userName: string;
  tasks: Task[];
}

interface FullData {
  meta: {
    status: string;
    message: string;
    totalUsers: number;
    timestamp: string;
  };
  data: Users[];
}

@Injectable({ providedIn: 'root' })
export class FeedService {
  private http = inject(HttpClient);
  private baseForm = inject(FormBuilder);

  
  public form: FormGroup = this.baseForm.group({
    userId: ['', Validators.required],      
    task: ['', Validators.required]
  });

  public fullData = signal<FullData | null>(null);
  public status = computed(() => this.fullData()?.meta.status ?? '');
  public message = computed(() => this.fullData()?.meta.message ?? '');
  public users = computed(() => this.fullData()?.data ?? []);

  public userId = this.form.get('userId')?.valueChanges.subscribe(res => this.userId = res);
  public task = this.form.get('task')?.valueChanges.subscribe(res => this.task = res)

  fetchData() {
    const headers = new HttpHeaders({
      'X-API-KEY': environment.API_KEY
    });
    //por a variavel do userId para dinâmica
    const body = {
      action: 'list',
      userId: this.userId,
    }
    return this.http.post<FullData>(`${environment.API_URL}/index.php`, body, { headers: headers }).subscribe(res => { this.fullData.set(res); console.log(res) });
  }
  createTask() {

    const headers = new HttpHeaders({
      'X-API-KEY': environment.API_KEY
    });
    //por a variavel do userId para dinâmica
    const body = {
      action: 'create',
      userId: this.userId,
      taskData: {task: this.task}
    }
    this.form.reset();
    this.http.post(`${environment.API_URL}/index.php`, body, { headers: headers }).subscribe(res => { console.log(body); console.log(res) });
    this.fetchData(); 
  }

  deleteTask(taskId: number) {
    const headers = new HttpHeaders({
      'X-API-KEY': environment.API_KEY
    });
    //por a variavel do userId para dinâmica
    const body = {
      action: 'delete',
      userId: this.userId,
      taskId: taskId
    }
    this.http.post<FullData>(`${environment.API_URL}/index.php`, body, { headers: headers }).subscribe(res => { console.log(res) });
    this.fetchData();     
  }

  changeTaskStatus(taskId: number){
    const headers = new HttpHeaders({
      'X-API-KEY': environment.API_KEY
    });
    //por a variavel do userId para dinâmica
    const body = {
      action: 'changeTaskStatus',
      userId: this.userId,
      taskId: taskId
    }
    this.http.post<FullData>(`${environment.API_URL}/index.php`, body, { headers: headers }).subscribe(res => { console.log(res) });
    this.fetchData();  
  }
}

