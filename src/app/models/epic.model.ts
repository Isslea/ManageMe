import {UserModel} from "./user.model";
import {StatusEnum} from "./status.enum";
import {TaskModel} from "./task.model";
import {PriorityEnum} from "./priority.enum";
import {ProjectModel} from "./project.model";

export interface EpicModel {
  name: string;
  description: string;
  priority: string;
  status: string;
  owner: UserModel;
  tasks: TaskModel[];
  createdTime?: Date;
  startTime?: Date;
  finishTime?: Date;
  id?: string;
}
