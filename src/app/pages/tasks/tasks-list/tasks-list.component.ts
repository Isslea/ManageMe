import {Component, OnInit} from '@angular/core';
import {EpicModel} from "../../../models/epic.model";
import {CrudService} from "../../../services/crud.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TaskModel} from "../../../models/task.model";
import {TaskFormComponent} from "../task-form/task-form.component";
import {StatusEnum} from "../../../models/status.enum";
import {CalculationsService} from "../../../services/calculations.service";
import {TimeService} from "../../../services/time.service";

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit{
  projectId: string;
  epicId: string;
  data: TaskModel[] = [];
  statuses: string[];
  currentStatuses: string[] = [];

  constructor(private crudService: CrudService, private route: ActivatedRoute, public timeService: TimeService) {
    this.projectId = this.route.snapshot.paramMap.get("project")!;
    this.epicId = this.route.snapshot.paramMap.get("epic")!;
    this.statuses =  Object.values(StatusEnum);
  }

  ngOnInit() {
    this.crudService.getAll<TaskModel>('tasks').subscribe(data => {
      this.data = data.filter(x => x.epicId === this.epicId)
      this.currentStatuses = this.data.map(x => x.status);
    })
  }





}
