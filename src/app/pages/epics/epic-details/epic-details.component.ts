import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {EpicModel} from "../../../models/epic.model";
import {CrudService} from "../../../services/crud.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TaskModel} from "../../../models/task.model";
import {StatusEnum} from "../../../models/status.enum";
import {UserModel} from "../../../models/user.model";
import {CalculationsService} from "../../../services/calculations.service";
import {TimeService} from "../../../services/time.service";

@Component({
  selector: 'app-epic-details',
  templateUrl: './epic-details.component.html',
  styleUrls: ['./epic-details.component.scss']
})
export class EpicDetailsComponent implements OnInit{
  @Input() tasks!: TaskModel[]
  epicData!: EpicModel
  projectId: string;
  epicId: string;
  statuses: string[];
  isTasksAreDone!: boolean;
  epicsUsers!: UserModel[];
  workingTime!: number;
  tasksToDelete!: string[];

  constructor(private crudService: CrudService, private route: ActivatedRoute, private router: Router, private calc: CalculationsService, public timeService: TimeService) {
    this.projectId = this.route.snapshot.paramMap.get("project")!;
    this.epicId = this.route.snapshot.paramMap.get("epic")!;
    this.statuses = Object.values(StatusEnum)
  }

  ngOnInit() {
    this.crudService.getById<EpicModel>(`epics`, this.epicId).subscribe(data => {
      this.epicData = data;
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tasks']) {
      this.isTasksAreDone = this.tasks && this.tasks.some(task => task.finishedTime === undefined)
      if (this.tasks) {
        this.epicsUsers = this.calc.getUsers(this.tasks);
        this.workingTime = this.calc.getWorkingTime(this.tasks);
        this.tasksToDelete = this.tasks.map(x => x.id).filter(id => !!id) as string[];
      }

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

    if (updatedData) {
      this.crudService.updatePartial<EpicModel>(updatedData, `epics`, this.epicId).subscribe(data => {
        window.location.reload();
      })
    }
  }

  delete(name: string) {
    this.crudService.deleteRelated('tasks', this.tasksToDelete).subscribe(() => {
      this.crudService.deleteById('epics', this.epicId, name)!.subscribe(() => {
        this.router.navigate([`${this.projectId}/epics`]);
      });
    });
  }
}
