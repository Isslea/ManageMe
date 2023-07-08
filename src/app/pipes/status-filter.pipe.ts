import { Pipe, PipeTransform } from '@angular/core';
import {StatusEnum} from "../models/status.enum";

@Pipe({
  name: 'statusFilter'
})
export class StatusFilterPipe implements PipeTransform {

  transform(data: any[], status: string): any[] {
    return data.filter(item => item.status === status);
  }

}
