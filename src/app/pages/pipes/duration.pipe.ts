import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(endDate: Date, startDate: Date): string {
    const duration = new Date(endDate).getTime() - new Date(startDate).getTime()
    const hours = Math.floor(duration / (1000 * 60 * 60))
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);

    const displayHours = hours <= 0 ? '' : hours + " h";
    const displayMinutes = minutes <= 0 ? '' : minutes + " m";
    const displaySeconds = seconds <= 0 ? '' : seconds + " s"

    return `${displayHours} ${displayMinutes} ${displaySeconds}`;
  }

}
