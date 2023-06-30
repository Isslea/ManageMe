import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EpicModel} from "../../../models/epic.model";
import {CrudService} from "../../../services/crud.service";
import {UserService} from "../../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PriorityEnum} from "../../../models/priority.enum";
import {StatusEnum} from "../../../models/status.enum";
import {TaskModel} from "../../../models/task.model";
import {UserModel} from "../../../models/user.model";

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
  filename!: string;
  users: UserModel[];
  priorities: string[];
  statuses: string[];
  selectedUser: string = "";
  selectedPriority: string = ""

  constructor(private crudService: CrudService, private userService: UserService, private route: ActivatedRoute, private router: Router) {
    this.users = this.userService.getUsers();
    this.priorities = Object.values(PriorityEnum);
    this.statuses = Object.values(StatusEnum);
    this.isEditMode = this.route.snapshot.routeConfig?.path?.includes('edit')!
    this.projectId = this.route.snapshot.paramMap.get("project")!;
    this.epicId = this.route.snapshot.paramMap.get('epic')!;
    this.taskId = this.route.snapshot.paramMap.get('task')!;
    this.filename = `projects/${this.projectId}/epics/${this.epicId}/tasks`

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
      this.crudService.updatePartial<TaskModel>(data, this.filename, this.taskId).subscribe(()=> {
          this.router.navigate([`/${this.projectId}/${this.epicId}/${this.taskId}/details`]);
        }
      );
    } else {
      data.createdTime = new Date();
      data.status = StatusEnum.toDo;
      this.crudService.sendForm<TaskModel>(data, this.filename).subscribe(x => {
        this.form.reset()
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
    this.crudService.getById<TaskModel>(this.filename, this.taskId).subscribe(data => {
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
