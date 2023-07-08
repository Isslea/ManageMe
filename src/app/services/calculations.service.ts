import { Injectable } from '@angular/core';
import {TaskModel} from "../models/task.model";
import {UserModel} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class CalculationsService {

  constructor() { }

  getWorkingTime(tasks: TaskModel[]): number {
    const durations = tasks.map(task => {
      if (task.finishedTime && task.startedTime) {
        const finishTime = new Date(task.finishedTime);
        const startTime = new Date(task.startedTime);
        return finishTime.getTime() - startTime.getTime();
      }
      return 0;
    });
    return durations.reduce((sum, duration) => sum + duration, 0);
  }


  getUsers(tasks: TaskModel[]): UserModel[] {
    const users = [...new Set(tasks.map(x => x.user))];
    let distinctUsers = [];
    if(users.length > 0) {
      distinctUsers = Array.from(new Set(users.map(x => JSON.stringify(x)))).map(x => JSON.parse(x));
    }
    return distinctUsers ? distinctUsers : users
  }

  getPredictedTime(tasks: TaskModel[]): Date {
    return tasks.reduce((latestDate, item) => {
      const currentDate = new Date(item.dueTime);
      if (!latestDate || currentDate > latestDate) {
        return currentDate;
      }
      return latestDate;
    }, new Date(0));
  }

}
