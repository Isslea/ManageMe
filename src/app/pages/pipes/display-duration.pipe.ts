import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayDuration'
})
export class DisplayDurationPipe implements PipeTransform {

  transform(duration: number): string {
    const days = Math.floor(duration / (1000 * 60 * 60 * 24));
    const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);

    let displayDuration = "";

    if (days > 0) {
      displayDuration = days + " d";
    } else {
      if (hours > 0) {
        displayDuration += hours + " h";
      }
      if (minutes > 0) {
        displayDuration += " " + minutes + " m";
      }
      if (seconds > 0) {
        displayDuration += " " + seconds + " s";
      }
    }

    return displayDuration.trim();
  }

}
