import {UserModel} from "./user.model";
import {StatusEnum} from "./status.enum";
import {PriorityEnum} from "./priority.enum";

export interface TaskModel {
  name: string;
  description: string;
  status: string;
  priority: string;
  createdTime: Date;
  startTime?: Date;
  dueTime: Date;
  finishTime?: Date;
  user: UserModel;
  id?: string;
}
