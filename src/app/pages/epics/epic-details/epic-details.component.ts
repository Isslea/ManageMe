import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {EpicModel} from "../../../models/epic.model";
import {CrudService} from "../../../services/crud.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TaskModel} from "../../../models/task.model";
import {StatusEnum} from "../../../models/status.enum";
import {UserModel} from "../../../models/user.model";
import {CalculationsService} from "../../../services/calculations.service";
import {TimeService} from "../../../services/time.service";
import {extractRouteParams} from "../../../functions/get-routes";
import {forkJoin, of} from "rxjs";

@Component({
  selector: 'app-epic-details',
  templateUrl: './epic-details.component.html',
  styleUrls: ['./epic-details.component.scss']
})
export class EpicDetailsComponent implements OnInit{
  @Input() taskData!: TaskModel[]
  projectId: string;
  epicId: string;
  statuses: string[];
  epicData!: EpicModel
  isTasksAreDone!: boolean;
  epicsUsers!: UserModel[];
  workingTime!: number;
  tasksToDelete!: string[];

  constructor(private crudService: CrudService, private router: Router, private route: ActivatedRoute,private calc: CalculationsService, public timeService: TimeService) {
    const { projectId, epicId} = extractRouteParams(route);
    this.projectId = projectId!;
    this.epicId = epicId!;
    this.statuses = Object.values(StatusEnum)
  }

  ngOnInit() {
    this.crudService.getById<EpicModel>(`epics`, this.epicId).subscribe(data => {
      this.epicData = data;
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['taskData'] && this.taskData) {
      this.isTasksAreDone = this.taskData.some(task => task.finishedTime === undefined)
      this.epicsUsers = this.calc.getUsers(this.taskData);
      this.workingTime = this.calc.getWorkingTime(this.taskData);
      this.tasksToDelete = this.taskData.map(x => x.id).filter(id => !!id) as string[];
    }
  }

  changeStatus() {
    let updatedData: Partial<EpicModel> = {};

    switch (this.epicData.status) {
      case StatusEnum.toDo:
        updatedData = {status: StatusEnum.doing, startedTime: new Date()};
        break;
      case StatusEnum.doing:
        updatedData = {status: StatusEnum.done, finishedTime: new Date()};
        break;
    }

    this.crudService.updatePartial<EpicModel>(updatedData, `epics`, this.epicId).subscribe(data => {
      window.location.reload();
    })
  }

  delete(name: string) {
    forkJoin([
      this.tasksToDelete.length > 0 ? this.crudService.deleteRelated('tasks', this.tasksToDelete) : of(null),
      this.crudService.deleteById('epics', this.epicId, name)!
    ]).subscribe(() => {
        this.router.navigate([`${this.projectId}/epics`]);
    });
  }
}
