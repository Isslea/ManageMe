import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {UserModel} from "../../../models/user.model";
import {CrudService} from "../../../services/crud.service";
import {Router} from "@angular/router";
import {LoggingService} from "../../../services/logging.service";
import {RoleEnum} from "../../../models/role.enum";
import {catchError, EMPTY, switchMap, tap, throwError} from "rxjs";
import {AuthModel} from "../../../models/auth.model";


@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class UserRegisterComponent implements OnInit{
  form!: FormGroup;
  user!: UserModel;
  errorEmail: string | null = null;
  errorPassword: string | null = null;

  constructor(private crudService: CrudService, private router: Router, private loggingService: LoggingService) {
  }

  ngOnInit() {
    this.form = this.createForm();
  }


  onSubmit(form: FormGroup) {
    const { firstName, lastName, email, password } = form.value;

    this.loggingService.signup(email, password).subscribe(data => {
      this.user = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        id: data.localId,
        role: RoleEnum.Admin
      }
      console.log(data)
      this.crudService.sendForm<UserModel>(this.user, 'users').subscribe((x) => {
        this.router.navigate([`projects`]);
      });
    }, errorMessage => {
      this.errorEmail = errorMessage;
    })

  }



  createForm(): FormGroup {
    return new FormGroup({
      'firstName': new FormControl(null, Validators.required),
      'lastName': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      'confirmPassword': new FormControl(null, [Validators.required, this.matchPasswordValidator.bind(this)])

    });
  }

  matchPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.root.get('password')?.value;
    const confirmPassword = control.value;
    if (password === confirmPassword) {
      return null;
    } else {
      return { passwordsNotMatch: true };
    }
  }

}
