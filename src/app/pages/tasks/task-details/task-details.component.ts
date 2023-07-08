import {Component, OnInit} from '@angular/core';
import {CrudService} from "../../../services/crud.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TaskModel} from "../../../models/task.model";
import {StatusEnum} from "../../../models/status.enum";
import {ProjectModel} from "../../../models/project.model";
import {EpicModel} from "../../../models/epic.model";
import {forkJoin} from "rxjs";
import {CalculationsService} from "../../../services/calculations.service";
import {TimeService} from "../../../services/time.service";

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit{
  projectId: string;
  project!: ProjectModel;
  epicId: string;
  epic!: EpicModel
  taskId: string;
  filename: string;
  data!: TaskModel;
  statuses: string[];


  constructor(private crudService: CrudService, private route: ActivatedRoute, private router: Router, public timeService: TimeService){
    this.projectId = this.route.snapshot.paramMap.get("project")!;
    this.epicId = this.route.snapshot.paramMap.get('epic')!;
    this.taskId = this.route.snapshot.paramMap.get('task')!;
    this.filename = `tasks`
    this.statuses = Object.values(StatusEnum);
  }

  ngOnInit() {
    forkJoin([
      this.crudService.getById<TaskModel>(this.filename, this.taskId),
      this.crudService.getById<ProjectModel>('projects', this.projectId),
      this.crudService.getById<EpicModel>(`epics`, this.epicId)
    ]).subscribe(([taskData, projectData, epicData]) => {
      this.data = taskData;
      this.project = projectData;
      this.epic = epicData;
    });
  }

  delete(name: string) {

    this.crudService.deleteById(this.filename, this.taskId, name)!.subscribe(() => {
      this.router.navigate([`${this.projectId}/${this.epicId}/tasks`]);
    });
  }

  changeStatus() {
    let updatedData: Partial<TaskModel> = {};

    switch (this.data.status) {
      case StatusEnum.toDo:
        updatedData = {status: StatusEnum.doing, startedTime: new Date()};
        forkJoin([
          this.crudService.updatePartial<TaskModel>(updatedData, this.filename, this.taskId),
          this.crudService.updatePartial<EpicModel>(updatedData, `epics`, this.epicId)
        ]).subscribe(() => {
          window.location.reload();
        });
        break;
      case StatusEnum.doing:
        updatedData = {status: StatusEnum.done, finishedTime: new Date()};
        this.crudService.updatePartial<TaskModel>(updatedData, this.filename, this.taskId).subscribe(data => {
          window.location.reload();
        })
        break;
    }
  }


}
