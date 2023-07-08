import {Component, OnInit} from '@angular/core';
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
  statuses: string[];
  currentStatuses!: string[];
  epicData: EpicModel[] = [];
  filteredData: EpicModel[] = [];

  constructor(private crudService: CrudService, private route: ActivatedRoute, private router: Router) {
    this.projectId = this.route.snapshot.paramMap.get("project")!;
    this.statuses = Object.values(StatusEnum)
  }

  ngOnInit() {
    this.crudService.getAll<EpicModel>('epics').subscribe(data => {
      this.epicData = data.filter(x => x.projectId === this.projectId)
      this.filteredData = this.epicData
      this.currentStatuses = this.epicData.map(x => x.status);
    })
  }

  delete(id: string, name: string) {
    this.crudService.deleteById('epics', id, name)!.subscribe(() => {
      window.location.reload();
    });
  }

  details(id: string)
  {
    this.router.navigate([`${this.projectId}/${id}/tasks`]);
  }

  filterEpics(status?: string) {
    if(!status && this.filteredData.length !== this.epicData.length)
    {
      this.filteredData = this.epicData
    }
    if(status) {
      this.filteredData = this.epicData.filter(x => x.status == status)
    }
  }
}
