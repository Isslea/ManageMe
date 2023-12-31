import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CrudService} from "../../../services/crud.service";
import {UserService} from "../../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PriorityEnum} from "../../../models/priority.enum";
import {StatusEnum} from "../../../models/status.enum";
import {TaskModel} from "../../../models/task.model";
import {UserModel} from "../../../models/user.model";
import {extractRouteParams} from "../../../functions/get-routes";

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit{
  form!: FormGroup;
  isEditMode: boolean;
  projectId: string;
  epicId: string;
  taskId: string;
  users: UserModel[];
  priorities: string[];
  statuses: string[];
  selectedUser: string = "";
  selectedPriority: string = ""

  constructor(private crudService: CrudService, private userService: UserService, private route: ActivatedRoute, private router: Router) {
    const { projectId, epicId, taskId, edit } = extractRouteParams(this.route);
    this.projectId = projectId!;
    this.taskId = taskId!;
    this.epicId = epicId!;
    this.isEditMode = edit!;
    this.users = this.userService.getUsers();
    this.priorities = Object.values(PriorityEnum);
    this.statuses = Object.values(StatusEnum);
  }


  ngOnInit() {
    this.form = this.createForm();
    if(this.isEditMode)
    {
      this.fillForm();
    }
}


  onSubmit(data: TaskModel) {
    data.user = this.users.find(x => x.id == this.selectedUser) as UserModel

    if(this.isEditMode) {
      this.crudService.updatePartial<TaskModel>(data, 'tasks', this.taskId).subscribe(()=> {
          this.router.navigate([`/${this.projectId}/${this.epicId}/${this.taskId}/details`]);
        }
      );
    } else {
      data.createdTime = new Date();
      data.status = StatusEnum.toDo;
      data.projectId = this.projectId;
      data.epicId = this.epicId;
      this.crudService.sendForm<TaskModel>(data, 'tasks').subscribe(x => {
        this.router.navigate([`${this.projectId}/${this.epicId}/tasks`]);
      });
    }
  }

  onDropdownChange(){
    this.selectedUser = this.form.value.user;
    this.selectedPriority = this.form.value.priority
  }

  createForm(): FormGroup {
    return new FormGroup({
      'name': new FormControl(null, Validators.required),
      'description': new FormControl(null),
      'priority': new FormControl(null, Validators.required),
      'user': new FormControl(null, Validators.required),
      'dueTime': new FormControl(null, [Validators.required, this.dateBeforeToday])
    });
  }

  fillForm() {
    this.crudService.getById<TaskModel>('tasks', this.taskId).subscribe(data => {
      this.form.patchValue({
        'name': data!.name,
        'description': data!.description,
        'priority': data!.priority,
        'user': data!.user.id,
        'dueTime': data!.dueTime,
      });
    });
  }

  dateBeforeToday(control: FormControl): { [s: string]: boolean } | null{
    const selectedDate = new Date(control.value);
    const today = new Date();

    if (selectedDate < today) {
      return { dateIsBeforeToday: true };
    }

    return null;
  }

}
