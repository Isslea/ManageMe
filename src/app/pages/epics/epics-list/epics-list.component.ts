import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CrudService} from "../../../services/crud.service";
import {EpicModel} from "../../../models/epic.model";
import {StatusEnum} from "../../../models/status.enum";

@Component({
  selector: 'app-epics-list',
  templateUrl: './epics-list.component.html',
  styleUrls: ['./epics-list.component.scss']
})
export class EpicsListComponent implements OnInit{
  projectId: string
  filename: string;
  epicData: EpicModel[] = [];
  filteredData: EpicModel[] = [];
  statuses: string[];

  constructor(private crudService: CrudService, private route: ActivatedRoute, private router: Router) {
    this.projectId = this.route.snapshot.paramMap.get("project")!;
    this.filename = `projects/${this.projectId}/epics`
    this.statuses = Object.values(StatusEnum)
  }

  ngOnInit() {

    this.crudService.getAll<EpicModel>(this.filename).subscribe(data => {
      this.epicData = data
      this.filteredData = data
    })

  }

  delete(id: string, name: string) {

    this.crudService.deleteById(this.filename, id, name)!.subscribe(() => {
      window.location.reload();
    });
  }

  details(id: string)
  {
    this.router.navigate([`${this.projectId}/${id}/tasks`]);
  }

  filterEpics(status: string) {
    if(this.filteredData.length !== this.epicData.length)
    {
      this.filteredData = this.epicData
    }
    else {
      this.filteredData = this.epicData.filter(x => x.status == status)
    }

  }




}
