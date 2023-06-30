import { Injectable } from '@angular/core';
import {UserModel} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: UserModel[] = [
    { id: '1', firstName: 'Jan', lastName: 'Kowalski'},
    { id: '2', firstName: 'Anna', lastName: 'Nowak'},
    { id: '3', firstName: 'Ewa', lastName: 'Kaczmarek'},
    { id: '4', firstName: 'Paweł', lastName: 'Wójcik'},
    { id: '5', firstName: 'Mateusz', lastName: 'Woźniak'},
    { id: '6', firstName: 'Natalia', lastName: 'Kowalczyk'}
  ];


  getUsers(): UserModel[] {
    return this.users;
  }

  getUserById(id: string){
    return this.users.find(x => x.id == id)
  }
}
