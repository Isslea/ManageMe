import {UserModel} from "./user.model";
import {EpicModel} from "./epic.model";

export interface ProjectModel {
  name: string;
  description: string;
  createdTime?: Date;
  finishedTime?: Date;
  id?: string;
}
