import {RoleEnum} from "./role.enum";

export interface UserModel {
  firstName: string;
  lastName: string;
  email: string;
  role: RoleEnum;
  id?: string;
}
