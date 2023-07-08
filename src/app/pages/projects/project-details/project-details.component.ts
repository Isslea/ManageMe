import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TaskModel} from "../../../models/task.model";
import {EpicModel} from "../../../models/epic.model";
import {CrudService} from "../../../services/crud.service";
import {ActivatedRoute, Router} from "@angular/router";
import {StatusEnum} from "../../../models/status.enum";
import {ProjectModel} from "../../../models/project.model";
import {UserModel} from "../../../models/user.model";
import {CalculationsService} from "../../../services/calculations.service";
import {forkJoin} from "rxjs";
import {TimeService} from "../../../services/time.service";
@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit, OnChanges{
  @Input() epics!: EpicModel[]
  tasks!: TaskModel[];
  projectData!: ProjectModel
  projectId: string;
  epicId: string;
  isEpicsAreDone!: boolean;
  users!: UserModel[]
  workingTime! : number;
  predictedTime! : Date;
  tasksToDelete!: string[];
  epicsToDelete!: string[];


  constructor(private crudService: CrudService, private route: ActivatedRoute, private router: Router, private calc: CalculationsService, public timeService: TimeService) {
    this.projectId = this.route.snapshot.paramMap.get("project")!;
    this.epicId = this.route.snapshot.paramMap.get("epic")!;

  }

  ngOnInit() {
    this.crudService.getById<ProjectModel>(`projects`, this.projectId).subscribe(data => {
      this.projectData = data;
    })

    this.crudService.getAll<TaskModel>("tasks").subscribe(data => {
      this.tasks = data.filter(x => x.projectId === this.projectId);
      this.users = this.calc.getUsers(this.tasks);
      this.workingTime = this.calc.getWorkingTime(this.tasks);
      this.predictedTime = this.calc.getPredictedTime(this.tasks);

      this.tasksToDelete = this.tasks.map(x => x.id).filter(id => !!id) as string[];

    })

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['epics'] && this.epics) {
        this.isEpicsAreDone = this.epics && this.epics.some((x) => x.finishedTime === undefined);
        this.epicsToDelete = this.epics.map(x => x.id).filter(id => !!id) as string[];
    }

  }

  finishProject(){
    const updatedData = {finishedTime: new Date() }
    this.crudService.updatePartial<ProjectModel>(updatedData, `projects`, this.projectId).subscribe(data => {
      window.location.reload();
    })

  }

  delete(name: string) {
    const deleteTasks$ = this.crudService.deleteRelated('tasks', this.tasksToDelete);
    const deleteEpics$ = this.crudService.deleteRelated('epics', this.epicsToDelete);

    forkJoin([deleteTasks$, deleteEpics$]).subscribe(() => {
      this.crudService.deleteById('projects', this.projectId, name)!.subscribe(() => {
        this.router.navigate(['/projects']);
      });
    });
  }
}
