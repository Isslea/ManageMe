import {UserModel} from "./user.model";
import {EpicModel} from "./epic.model";

export interface ProjectModel {
  name: string;
  description: string;
  epics: EpicModel[] | null;
  createdTime?: Date;
  finishedTime?: Date;
  id?: string;
}
