import {Injectable} from '@angular/core';
import {UserModel} from "../models/user.model";
import {RoleEnum} from "../models/role.enum";

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private users: UserModel[] = [
    { firstName: 'Jan', lastName: 'Kowalski', email: "lol", role: RoleEnum.Admin},
  ];



  getUsers(): UserModel[] {
    return this.users;
  }

  getUserById(id: string){
    return this.users.find(x => x.id == id)
  }

}
