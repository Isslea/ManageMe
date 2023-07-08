import {UserModel} from "./user.model";
import {StatusEnum} from "./status.enum";
import {PriorityEnum} from "./priority.enum";

export interface TaskModel {
  name: string;
  description: string;
  status: string;
  priority: string;
  projectId: string;
  epicId: string;
  createdTime: Date;
  startedTime?: Date;
  dueTime: Date;
  finishedTime?: Date;
  user: UserModel;
  id?: string;
}
