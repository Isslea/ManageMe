import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TaskModel} from "../../../models/task.model";
import {EpicModel} from "../../../models/epic.model";
import {CrudService} from "../../../services/crud.service";
import {ActivatedRoute, Router} from "@angular/router";
import {StatusEnum} from "../../../models/status.enum";
import {ProjectModel} from "../../../models/project.model";
import {UserModel} from "../../../models/user.model";

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit, OnChanges{
  @Input() epics!: EpicModel[]
  projectData!: ProjectModel
  projectId: string;
  epicId: string;
  isEpicsAreDone!: boolean;
  projectUsers!: UserModel[];
  projectWorkingTime! : number
  dueDate!: number;


  constructor(private crudService: CrudService, private route: ActivatedRoute, private router: Router) {
    this.projectId = this.route.snapshot.paramMap.get("project")!;
    this.epicId = this.route.snapshot.paramMap.get("epic")!;

  }

  ngOnInit() {
    this.crudService.getById<ProjectModel>(`projects`, this.projectId).subscribe(data => {
      this.projectData = data;
    })



  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['epics']) {
      if(this.epics) {
        this.isEpicsAreDone = this.epics && this.epics.some((x) => x.finishTime === undefined);
        this.projectUsers = this.getUsers()
        this.projectWorkingTime = this.getWorkingTime();
        this.dueDate = this.getPredictedTime()
      }
    }

  }

  finishProject(){
    const updatedData = {finishedTime: new Date() }
    this.crudService.updatePartial<ProjectModel>(updatedData, `projects`, this.projectId).subscribe(data => {
      window.location.reload();
    })

  }
  getCurrentTime(): Date {
    return new Date();
  }

  getUsers(): UserModel[] {
    const tasks = this.epics.flatMap(x => Object.values(x.tasks));
    return  Array.from(new Set(tasks.map(task => JSON.stringify(task.user)))).map(user => JSON.parse(user));
  }

  getWorkingTime(): number {
    const durations = this.epics.flatMap(epic => {
      const tasks = Object.values(epic.tasks);
      return tasks.map(task => {
        if (task.finishTime && task.startTime) {
          const finishTime = new Date(task.finishTime);
          const startTime = new Date(task.startTime);
          return finishTime.getTime() - startTime.getTime();
        }
        return 0;
      });
    });
    return durations.reduce((sum, duration) => sum + duration, 0);
  }

  delete(name: string) {
    this.crudService.deleteById(`projects`, this.projectId, name)!.subscribe(() => {
      this.router.navigate([`/projects`]);
    });
  }

  getPredictedTime(): number {
    const dueDates: Date[] = this.epics.reduce((dates: Date[], item) => {
      const taskDates = Object.values(item.tasks).map(task => new Date(task.dueTime));
      return dates.concat(taskDates);
    }, []);

    if (dueDates.length === 0) {
      return 0;
    }

    const farthestDate = dueDates.reduce((maxDate, currentDate) => {
      if (currentDate.getTime() > maxDate.getTime()) {
        return currentDate;
      } else {
        return maxDate;
      }
    });
   return farthestDate.getTime() - new Date().getTime()
  }


}
