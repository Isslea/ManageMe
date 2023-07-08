import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TaskModel} from "../../../models/task.model";
import {EpicModel} from "../../../models/epic.model";
import {CrudService} from "../../../services/crud.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectModel} from "../../../models/project.model";
import {UserModel} from "../../../models/user.model";
import {CalculationsService} from "../../../services/calculations.service";
import {forkJoin, of} from "rxjs";
import {TimeService} from "../../../services/time.service";
import {extractRouteParams} from "../../../functions/get-routes";
@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit, OnChanges{
  @Input() epicData!: EpicModel[]
  projectId: string;
  epicId: string;
  projectData!: ProjectModel
  tasks!: TaskModel[];
  users!: UserModel[]
  isEpicsAreDone!: boolean;
  workingTime! : number;
  predictedTime! : Date;
  tasksToDelete!: string[];
  epicsToDelete!: string[];


  constructor(private crudService: CrudService, private route: ActivatedRoute, private router: Router, private calc: CalculationsService, public timeService: TimeService) {
    const { projectId, epicId} = extractRouteParams(route);
    this.projectId = projectId!;
    this.epicId = epicId!;
  }

  ngOnInit() {
    forkJoin([
      this.crudService.getById<ProjectModel>(`projects`, this.projectId),
      this.crudService.getAll<TaskModel>("tasks")
    ]).subscribe(([projectData, taskData]) => {
      this.projectData = projectData;
      this.tasks = taskData.filter(x => x.projectId === this.projectId);
      this.tasksToDelete = this.tasks.map(x => x.id).filter(id => !!id) as string[];
      this.users = this.calc.getUsers(this.tasks);
      this.workingTime = this.calc.getWorkingTime(this.tasks);
      this.predictedTime = this.calc.getPredictedTime(this.tasks);
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['epicData'] && this.epicData ) {
        this.isEpicsAreDone = this.epicData.some((x) => x.finishedTime === undefined);
        this.epicsToDelete = this.epicData.map(x => x.id).filter(id => !!id) as string[];
    }
  }

  finishProject(){
    const updatedData = {finishedTime: new Date() }
    this.crudService.updatePartial<ProjectModel>(updatedData, `projects`, this.projectId).subscribe(data => {
      window.location.reload();
    })
  }

  delete(name: string) {
    forkJoin([
      this.tasksToDelete.length > 0 ? this.crudService.deleteRelated('tasks', this.tasksToDelete) : of(null),
      this.tasksToDelete.length > 0 ? this.crudService.deleteRelated('epics', this.epicsToDelete) : of(null)
    ]).subscribe(() => {
      this.crudService.deleteById('projects', this.projectId, name)!.subscribe(() => {
        this.router.navigate(['/projects']);
      });
    });
  }
}
