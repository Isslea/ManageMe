import {Component, OnInit} from '@angular/core';
import {CrudService} from "../../../services/crud.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TaskModel} from "../../../models/task.model";
import {StatusEnum} from "../../../models/status.enum";
import {TimeService} from "../../../services/time.service";
import {extractRouteParams} from "../../../functions/get-routes";

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit{
  projectId: string;
  epicId: string;
  taskData: TaskModel[] = [];
  statuses: string[];
  currentStatuses: string[] = [];

  constructor(private crudService: CrudService, private route: ActivatedRoute, public timeService: TimeService) {
    const { projectId, epicId } = extractRouteParams(this.route);
    this.projectId = projectId;
    this.epicId = epicId!;
    this.statuses =  Object.values(StatusEnum);
  }

  ngOnInit() {
    this.crudService.getAll<TaskModel>('tasks').subscribe(data => {
      this.taskData = data.filter(x => x.epicId === this.epicId)
      this.currentStatuses = this.taskData.map(x => x.status);
    })
  }





}
