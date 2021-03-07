import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeInterval',
  pure: true
})
export class TimeIntervalPipe implements PipeTransform {

  /**
   * Convert seconds to mm:ss format
   * @param seconds - Total Seconds
   */
  transform(seconds: number): string {
    return (seconds > 0)
      ? `${Math.floor(seconds % 3600 / 60).toString().padStart(2, '0')}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`
      : '00:00';
  }

}
