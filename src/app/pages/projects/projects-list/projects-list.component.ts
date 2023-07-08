import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ProjectModel} from "../../../models/project.model";
import {CrudService} from "../../../services/crud.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent implements OnInit{
  data!: ProjectModel[]


  constructor(private crudService: CrudService, private router: Router) {
  }

  ngOnInit() {
    this.crudService.getAll<ProjectModel>('projects').subscribe(data => {
        this.data = data
      }
    )
  }



  delete(id: string, name: string) {
    this.crudService.deleteById('projects', id, name)!.subscribe(() => {
      this.router.navigate(['projects']);
    });
  }

  details(id: string) {
    this.router.navigate([`${id}/epics`]);
  }

}
