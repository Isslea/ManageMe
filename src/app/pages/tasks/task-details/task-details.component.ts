import {Component, OnInit} from '@angular/core';
import {CrudService} from "../../../services/crud.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TaskModel} from "../../../models/task.model";
import {StatusEnum} from "../../../models/status.enum";
import {ProjectModel} from "../../../models/project.model";
import {EpicModel} from "../../../models/epic.model";
import {forkJoin} from "rxjs";
import {TimeService} from "../../../services/time.service";
import {extractRouteParams} from "../../../functions/get-routes";

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit{
  projectId: string;
  epicId: string;
  taskId: string;
  statuses: string[];
  projectData!: ProjectModel;
  epicData!: EpicModel
  taskData!: TaskModel;


  constructor(private crudService: CrudService, private route: ActivatedRoute, private router: Router, public timeService: TimeService){
    const { projectId, epicId, taskId } = extractRouteParams(route);
    this.projectId = projectId!;
    this.epicId = epicId!;
    this.taskId = taskId!;
    this.statuses = Object.values(StatusEnum);
  }

  ngOnInit() {
    forkJoin([
      this.crudService.getById<ProjectModel>('projects', this.projectId),
      this.crudService.getById<EpicModel>(`epics`, this.epicId),
      this.crudService.getById<TaskModel>('tasks', this.taskId)
    ]).subscribe(([projectData, epicData, taskData]) => {
      this.projectData = projectData;
      this.epicData = epicData;
      this.taskData = taskData;
    });
  }

  delete(name: string) {
    this.crudService.deleteById('tasks', this.taskId, name)!.subscribe(() => {
      this.router.navigate([`${this.projectId}/${this.epicId}/tasks`]);
    });
  }

  changeStatus() {
    let updatedData: Partial<TaskModel> = {};

    switch (this.taskData.status) {
      case StatusEnum.toDo:
        updatedData = {status: StatusEnum.doing, startedTime: new Date()};
        break;
      case StatusEnum.doing:
        updatedData = {status: StatusEnum.done, finishedTime: new Date()};
        break;
    }

    if(this.epicData.status == StatusEnum.toDo){
      forkJoin([
        this.crudService.updatePartial<TaskModel>(updatedData, 'tasks', this.taskId),
        this.crudService.updatePartial<EpicModel>(updatedData, `epics`, this.epicId)
      ]).subscribe(() => {
        window.location.reload();
      });
    }
    else {
      this.crudService.updatePartial<TaskModel>(updatedData, 'tasks', this.taskId).subscribe(data => {
        window.location.reload();
      })
    }
  }
}
