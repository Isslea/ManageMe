import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ProjectModel} from "../../../models/project.model";
import {CrudService} from "../../../services/crud.service";
import {ActivatedRoute, Router} from "@angular/router";
import {extractRouteParams} from "../../../functions/get-routes";

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent implements OnInit{
  form!: FormGroup;
  projectId: string;
  isEditMode: boolean;

  constructor(private crudService: CrudService, private route: ActivatedRoute, private router: Router) {
    const { projectId, edit } = extractRouteParams(this.route);
    this.projectId = projectId!;
    this.isEditMode = edit!
  }

  ngOnInit() {
    this.form = this.createForm();
    if(this.isEditMode)
    {
      this.fillForm();
    }
  }

  onSubmit(data: ProjectModel) {
    if(this.isEditMode) {
      this.crudService.updatePartial<ProjectModel>(data, 'projects', this.projectId).subscribe(()=> {
          this.router.navigate([`${this.projectId}/epics`]);
        }
      );
    } else {
      data.createdTime = new Date();
      this.crudService.sendForm<ProjectModel>(data, 'projects').subscribe(x => {
        this.router.navigate(['projects']);
      });
    }
  }

  createForm(): FormGroup {
    return new FormGroup({
      'name': new FormControl(null, Validators.required),
      'description': new FormControl(null),
    });
  }

  fillForm() {
    this.crudService.getById<ProjectModel>('projects', this.projectId).subscribe(data => {
      this.form.patchValue({
        'name': data!.name,
        'description': data!.description,
      });
    });
  }

}
