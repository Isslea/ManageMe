import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {EpicModel} from "../../../models/epic.model";
import {CrudService} from "../../../services/crud.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TaskModel} from "../../../models/task.model";
import {StatusEnum} from "../../../models/status.enum";
import {UserModel} from "../../../models/user.model";

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

  constructor(private crudService: CrudService, private route: ActivatedRoute, private router: Router) {
    this.projectId = this.route.snapshot.paramMap.get("project")!;
    this.epicId = this.route.snapshot.paramMap.get("epic")!;
    this.statuses = Object.values(StatusEnum)
  }

  ngOnInit() {
    this.crudService.getById<EpicModel>(`projects/${this.projectId}/epics`, this.epicId).subscribe(data => {
      this.epicData = data;
    })

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tasks']) {
      this.isTasksAreDone = this.tasks && this.tasks.some(task => task.finishTime === undefined)
      if(this.tasks) {
        this.epicsUsers = this.getUsers();
      }
    }

  }


  changeStatus() {
    let updatedData: Partial<EpicModel> = {};

    switch (this.epicData.status) {
      case StatusEnum.toDo:
        updatedData = {status: StatusEnum.doing, startTime: new Date()};
        break;
      case StatusEnum.doing:
        updatedData = {status: StatusEnum.done, finishTime: new Date()};
        break;
    }

    if (updatedData) {
      this.crudService.updatePartial<EpicModel>(updatedData, `projects/${this.projectId}/epics`, this.epicId).subscribe(data => {
        window.location.reload();
      })
    }
  }
  getCurrentTime(): Date {
    return new Date();
  }

  getWorkingTime(): number {
    const durations = this.tasks.map(task => {
      if (task.finishTime && task.startTime) {
        const finishTime = new Date(task.finishTime);
        const startTime = new Date(task.startTime);
        return finishTime.getTime() - startTime.getTime();
      }
      return 0;
    });
    return durations.reduce((sum, duration) => sum + duration, 0);
  }

  getUsers(): UserModel[] {
    return Array.from(new Set(this.tasks.map(x => JSON.stringify(x.user)))).map(user => JSON.parse(user));
  }

  delete(name: string) {
    this.crudService.deleteById(`projects/${this.projectId}/epics`, this.epicId, name)!.subscribe(() => {
      this.router.navigate([`${this.projectId}/epics`]);
    });
  }
}
