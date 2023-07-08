import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CrudService} from "../../../services/crud.service";
import {ActivatedRoute, Router} from "@angular/router";
import {EpicModel} from "../../../models/epic.model";
import {UserService} from "../../../services/user.service";
import {UserModel} from "../../../models/user.model";
import {StatusEnum} from "../../../models/status.enum";
import {PriorityEnum} from "../../../models/priority.enum";

@Component({
  selector: 'app-epic-form',
  templateUrl: './epic-form.component.html',
  styleUrls: ['./epic-form.component.scss']
})
export class EpicFormComponent implements OnInit{
  form!: FormGroup;
  isEditMode: boolean;
  projectId: string;
  epicId: string;
  filename!: string;
  users: UserModel[];
  priorities: string[];
  statuses: string[];
  selectedUser: string = "";
  selectedPriority: string = ""

  constructor(private crudService: CrudService, private userService: UserService, private route: ActivatedRoute, private router: Router) {
    this.users = this.userService.getUsers();
    this.priorities = Object.values(PriorityEnum);
    this.statuses = Object.values(StatusEnum);
    this.isEditMode = this.route.snapshot.routeConfig?.path?.includes('edit')!
    this.projectId = this.route.snapshot.paramMap.get("project")!;
    this.epicId = this.route.snapshot.paramMap.get('epic')!;
    this.filename = `epics`

  }

  ngOnInit() {
    this.form = this.createForm();

    if(this.isEditMode)
    {
      this.fillForm();
    }
  }

  onSubmit(data: EpicModel) {
    data.owner = this.users.find(x => x.id == this.selectedUser) as UserModel

    if(this.isEditMode) {
      this.crudService.updatePartial<EpicModel>(data, this.filename, this.epicId).subscribe(()=> {
          this.router.navigate([`${this.projectId}/${this.epicId}/tasks`]);
        }
      );
    } else {
      data.status = StatusEnum.toDo;
      data.createdTime = new Date();
      data.projectId = this.projectId;
      this.crudService.sendForm<EpicModel>(data, this.filename).subscribe(x => {
        this.form.reset()
        this.router.navigate([`${this.projectId}/epics`]);
      });
    }
  }

  onDropdownChange(){
    this.selectedUser = this.form.value.owner;
    this.selectedPriority = this.form.value.priority
  }


  createForm(): FormGroup {
    return new FormGroup({
      'name': new FormControl(null, Validators.required),
      'description': new FormControl(null),
      'priority': new FormControl(null, Validators.required),
      'owner': new FormControl(null)
    });
  }

  fillForm() {
    this.crudService.getById<EpicModel>(this.filename, this.epicId).subscribe(data => {
      this.form.patchValue({
        'name': data!.name,
        'description': data!.description,
        'priority': data!.priority,
        'owner': data!.owner.id
      });
    });
  }
}
