import {Component, OnInit} from '@angular/core';
import {EpicModel} from "../../../models/epic.model";
import {CrudService} from "../../../services/crud.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TaskModel} from "../../../models/task.model";
import {TaskFormComponent} from "../task-form/task-form.component";
import {StatusEnum} from "../../../models/status.enum";

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit{
  projectId: string;
  epicId: string;
  filename: string;
  data: TaskModel[] = [];
  statuses: string[];
  currentStatuses: string[] = [];

  constructor(private crudService: CrudService, private route: ActivatedRoute, private router: Router) {
    this.projectId = this.route.snapshot.paramMap.get("project")!;
    this.epicId = this.route.snapshot.paramMap.get("epic")!;
    this.filename = `projects/${this.projectId}/epics/${this.epicId}/tasks`
    this.statuses =  Object.values(StatusEnum);
  }

  ngOnInit() {
    this.crudService.getAll<TaskModel>(this.filename).subscribe(data => {
      this.data = data
      this.currentStatuses = this.data.map(x => x.status);

    })
  }

  delete(id: string, name: string) {

    this.crudService.deleteById(this.filename, id, name)!.subscribe(() => {
      window.location.reload();
    });
  }

  getCurrentTime(): Date {
    return new Date();
  }
}
