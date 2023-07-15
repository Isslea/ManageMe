import {RoleEnum} from "./role.enum";

export interface UserLoggedModel {
  userId: string;
  expiration: number;
  role?: RoleEnum;
}
