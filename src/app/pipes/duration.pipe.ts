import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(value: number | { startDate: Date, endDate: Date }): string {
    let duration: number;
    let startDate: Date;
    let endDate: Date;

    if (typeof value === 'number') {
      duration = value;
    } else {
      startDate = value.startDate;
      endDate = value.endDate;
      duration = new Date(endDate).getTime() - new Date(startDate).getTime();
    }

    const days = Math.floor(duration / (1000 * 60 * 60 * 24));
    const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);

    let displayDuration = '';

    if (days > 0) {
      displayDuration = days + 'd';
    } else if (hours > 0) {
      displayDuration = hours + 'h';
    } else if (minutes > 0) {
      displayDuration = minutes + 'm';
    } else if (seconds > 0) {
      displayDuration = seconds + 's';
    }

    return displayDuration.trim();
  }

}
