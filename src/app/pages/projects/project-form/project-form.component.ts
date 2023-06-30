import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ProjectModel} from "../../../models/project.model";
import {CrudService} from "../../../services/crud.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent implements OnInit{
  form!: FormGroup;
  isEditMode: boolean;
  projectId: string;
  filename: string = "projects"

constructor(private crudService: CrudService, private route: ActivatedRoute, private router: Router) {
  this.isEditMode = this.route.snapshot.url[1].path.includes('edit')
  this.projectId = this.route.snapshot.paramMap.get('project')!;
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
      this.crudService.updatePartial<ProjectModel>(data, this.filename, this.projectId).subscribe(()=> {
          this.router.navigate([`${this.projectId}/epics`]);
        }
      );
    } else {
      data.createdTime = new Date();
      this.crudService.sendForm<ProjectModel>(data, this.filename).subscribe(x => {
        this.form.reset()
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
    this.crudService.getById<ProjectModel>(this.filename, this.projectId).subscribe(data => {
      this.form.patchValue({
        'name': data!.name,
        'description': data!.description,
      });
    });
  }

}
