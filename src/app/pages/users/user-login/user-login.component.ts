import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {RoleEnum} from "../../../models/role.enum";
import {UserModel} from "../../../models/user.model";
import {LoggingService} from "../../../services/logging.service";
import {UserLoggedModel} from "../../../models/userLogged.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent {
  form!: FormGroup;
  errorPassword!: string;

  constructor(private loggingService: LoggingService, private router: Router) {
    this.form = this.createForm();
  }

  onSubmit(form: FormGroup) {
    const { email, password } = form.value;

    this.loggingService.login(email, password).subscribe(data => {
      const currentTime = new Date().getTime() / 1000;
      const expirationTime = currentTime + Number(data.expiresIn)
      const userLogged: UserLoggedModel =  { userId: data.localId, expiration: expirationTime}
      localStorage.setItem('userLogged', JSON.stringify(userLogged))
      this.router.navigate([`/projects`]);

      this.loggingService.setUserLogged(true);

    }, errorMessage => {
      this.errorPassword = errorMessage;
    })
  }


  createForm(): FormGroup {
    return new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, Validators.required),
    });
  }

}
